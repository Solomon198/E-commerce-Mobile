import React from 'react';
import {
  View,
  StyleSheet,
  Alert,
  TextInput,
  BackHandler,
  Keyboard,
} from 'react-native';
import {
  H1,
  Container,
  Body,
  Text,
  Icon,
  Header,
  Button,
  Left,
} from 'native-base';
import Colors from '../../configs/styles/index';
import firestore from '@react-native-firebase/firestore';
import {Navigation} from 'react-native-navigation';
import {batch, connect} from 'react-redux';
import {LiteCreditCardInput} from 'react-native-credit-card-input';
import NavigationScreens from '../../../nav.config/navigation.screens';
import {
  AddCreditCard,
  inputActionType,
  PaymentSuccess,
} from '../../configs/global.enum';
import * as joi from 'react-native-joi';
import SpinKit from 'react-native-spinkit';
import User from '../types/user';
import {formatAmountWithComma} from '../utilities/helper.funcs';
// @ts-ignore
import RNPaystack from 'react-native-paystack';

RNPaystack.init({
  publicKey: 'pk_test_7bad3f89963baf08caed993b86a42165b222d6a5',
});

const Pay = async (payload: any) => {
  const {cvc, email, number, expiry, amount} = payload;
  const [month, year] = expiry.split('/');
  return RNPaystack.chargeCard({
    cardNumber: number.split(' ').join(''),
    expiryMonth: month,
    expiryYear: year,
    cvc: cvc,
    email: email,
    amountInKobo: amount * 100,
  });
};

const validateEmail = joi.object({
  email: joi.string().email().required(),
});

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  input: {
    padding: 10,
    marginLeft: 5,
    marginBottom: 5,
  },
  header: {backgroundColor: '#fff'},
  headerLeft: {maxWidth: 50},
  mainContainerSub: {paddingHorizontal: 10},
  pageTitle: {fontWeight: 'bold', marginVertical: 10, marginLeft: 10},
  cardInput: {
    borderBottomColor: Colors.Brand.brandColor,
    borderBottomWidth: 1,
  },
  errorCardText: {color: 'red', marginLeft: 10, marginVertical: 5},
  noteChargesContainer: {marginHorizontal: 15},
  flexContainer: {
    flex: 1,
  },
  noteChargesText: {fontSize: 15},
  learnMoreText: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 5,
    color: Colors.Brand.brandColor,
  },
  btnAddCard: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
  addCardIcon: {color: '#fff', fontSize: 23},
  addCardText: {fontWeight: 'bold'},
});

type Props = {
  componentId: string;
  userCards: any[];
  addCardEnabled: boolean;
  cardEmail: string;
  addCreditCardStatus: string;
  addCreditCardError: string;
  carts: any[];
  user: User;
  setCardEmail: (email: string) => void;
  addCard: (card: any) => void;
  enableAddCreditCardButton: (payload: boolean) => void;
  paymentSuccess: () => void;
};

const mapStateToProps = (store: any) => ({
  userCards: store.User.userCards,
  addCreditCardStatus: store.User.addCreditCardStatus,
  addCreditCardError: store.User.addCreditCardError,
  addCardEnabled: store.User.addCardEnabled,
  user: store.Auth.user,
  cardEmail: store.User.cardEmail,
  carts: store.User.carts,
});

const mapDispatchStateToProps = (dispatch: any) => ({
  addCard: (payload: any) =>
    dispatch({type: AddCreditCard.ADD_CREDIT_CARD_CALLER, payload: payload}),
  enableAddCreditCardButton: (payload: boolean) =>
    dispatch({type: 'DO-ENABLE-ADD-BUTTON', payload: payload}),
  setCardEmail: (email: string) =>
    dispatch({type: inputActionType.SET_CARD_EMAIL, payload: email}),
  paymentSuccess: () => dispatch({type: PaymentSuccess.PAYMENT_CALLER}),
});

class CreditCard extends React.Component<Props> {
  state = {
    email: '',
    error: '',
    addCardEnabled: false,
    isPaying: false,
  };
  searchPickUp() {
    Navigation.push(this.props.componentId, {
      component: {
        id: NavigationScreens.SEARCH_PICKUP_SCREEN,
        name: NavigationScreens.SEARCH_PICKUP_SCREEN,
      },
    });
  }

  validCard: any;
  timer: any;

  goBack() {
    Navigation.pop(this.props.componentId);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackAction);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackAction);
  }

  handleBackAction = () => {
    if (
      this.props.addCreditCardStatus === AddCreditCard.ADD_CREDEIT_CARD_STARTED
    ) {
      return true;
    }
    this.goBack();
    return false;
  };

  addCard(card: any) {
    Keyboard.dismiss();
    const {error} = validateEmail.validate({email: this.state.email});
    if (error) {
      return this.setState({error: error.details[0].message});
    }

    this.setState({isPaying: true});

    Pay({
      ...card,
      email: this.state.email,
      amount: (this.getTotalSum() * 100).toString(),
    })
      .then((result) => {
        const batch = firestore().batch();
        this.props.carts.forEach((item) => {
          const docREf = firestore().collection('Orders').doc();
          batch.set(docREf, {
            ...item,
            customerId: this.props.user.userId,
            customer: this.props.user,
            status: 'NOT-DELIVERED',
            sellerId: item.userId.userId,
          });
        });
        batch.commit().then(() => {
          this.props.paymentSuccess();
          Navigation.popToRoot(this.props.componentId);
        });
      })
      .catch((e) => console.log(e));
  }

  validateCard(value: any) {
    const {number, expiry, cvc} = value.status;
    if (number === 'valid' && expiry === 'valid' && cvc === 'valid') {
      this.validCard = {
        number: value.values.number,
        cvc: value.values.cvc,
        expiry: value.values.expiry,
      };
      this.enableAddCreditCardButton(true);
    } else {
      this.enableAddCreditCardButton(false);
    }
  }

  enableAddCreditCardButton(status: boolean) {
    this.setState({addCardEnabled: status});
  }

  getTotalSum() {
    let total: number = 0;
    this.props.carts.forEach((item) => {
      total += parseInt(item.price) * item.count; // eslint-disable-line
    });
    return total;
  }

  render() {
    return (
      <Container style={styles.mainContainer}>
        <Header
          androidStatusBarColor={Colors.Brand.brandColor}
          hasTabs
          style={styles.header}>
          <Left style={styles.headerLeft}>
            <Button onPress={() => this.handleBackAction()} dark transparent>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body />
        </Header>

        <View style={styles.mainContainerSub}>
          <H1 style={styles.pageTitle}>Credit Card</H1>
          {this.state.error || this.props.addCreditCardError ? (
            <Text note style={styles.errorCardText}>
              {this.state.error || this.props.addCreditCardError}
            </Text>
          ) : null}
          <LiteCreditCardInput
            autoFocus
            onChange={(values: any) => this.validateCard(values)}
            placeholders={{
              number: 'Card PIN',
              expiry: 'MM/YY',
              cvc: 'CVC',
              email: 'email',
            }}
            inputStyle={styles.cardInput}
          />
          <View>
            <TextInput
              value={this.state.email}
              style={styles.input}
              placeholder="Email Address"
              onChangeText={(text) => {
                this.setState({email: text});
                this.setState({error: ''});
              }}
            />
          </View>
        </View>
        <View style={styles.flexContainer} />
        <View style={styles.noteChargesContainer}>
          <Text style={styles.noteChargesText}>
            {' '}
            Note your account will be charged ₦
            {formatAmountWithComma(this.getTotalSum())},
          </Text>
          <Text> which is the amount for the items selected in the cart.</Text>
        </View>

        <Text />
        <Button
          onPress={() => this.addCard(this.validCard)}
          disabled={!this.state.addCardEnabled || this.state.isPaying}
          iconLeft
          large
          rounded
          block
          style={[
            {
              backgroundColor:
                this.state.addCardEnabled || !this.state.isPaying
                  ? Colors.Brand.brandColor
                  : Colors.Brand.getBrandColorByOpacity(0.4),
            },
            styles.btnAddCard,
          ]}>
          <Icon
            style={styles.addCardIcon}
            type="FontAwesome5"
            name="credit-card"
          />
          <Text uppercase={false} style={styles.addCardText}>
            Pay
          </Text>
          {this.state.isPaying === true && (
            <SpinKit type="Circle" color="#fff" />
          )}
        </Button>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchStateToProps)(CreditCard);
