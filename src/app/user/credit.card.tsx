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
import {Navigation} from 'react-native-navigation';
import {connect} from 'react-redux';
import {LiteCreditCardInput} from 'react-native-credit-card-input';
import NavigationScreens from '../../../nav.config/navigation.screens';
import {AddCreditCard, inputActionType} from '../../configs/global.enum';
import * as joi from 'react-native-joi';
import SpinKit from 'react-native-spinkit';
import User from '../types/user';

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
  user: User;
  setCardEmail: (email: string) => void;
  addCard: (card: any) => void;
  enableAddCreditCardButton: (payload: boolean) => void;
};

const mapStateToProps = (store: any) => ({
  userCards: store.User.userCards,
  addCreditCardStatus: store.User.addCreditCardStatus,
  addCreditCardError: store.User.addCreditCardError,
  addCardEnabled: store.User.addCardEnabled,
  user: store.Auth.user,
  cardEmail: store.User.cardEmail,
});

const mapDispatchStateToProps = (dispatch: any) => ({
  addCard: (payload: any) =>
    dispatch({type: AddCreditCard.ADD_CREDIT_CARD_CALLER, payload: payload}),
  enableAddCreditCardButton: (payload: boolean) =>
    dispatch({type: 'DO-ENABLE-ADD-BUTTON', payload: payload}),
  setCardEmail: (email: string) =>
    dispatch({type: inputActionType.SET_CARD_EMAIL, payload: email}),
});

class CreditCard extends React.Component<Props> {
  state = {
    error: '',
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
    const {error} = validateEmail.validate({email: this.props.cardEmail});
    if (error) {
      return this.setState({error: error.details[0].message});
    }
    if (!this.props.userCards) {
      return this.props.addCard({
        ...card,
        email: this.props.cardEmail,
        userId: this.props.user.userId,
      });
    }
    let cardAlreadyAdded = false;
    this.props.userCards.forEach((item) => {
      if (card.number.split(' ').join('') === item.cardNumber) {
        cardAlreadyAdded = true;
      }
    });

    if (!cardAlreadyAdded) {
      this.props.addCard({
        ...card,
        email: this.props.cardEmail,
        userId: this.props.user.userId,
      });
      return;
    } else {
      Alert.alert(
        'Card Already Used',
        'This card have been added to your card list',
      );
    }
  }

  validateCard(value: any) {
    const {number, expiry, cvc} = value.status;
    if (number === 'valid' && expiry === 'valid' && cvc === 'valid') {
      this.validCard = {
        number: value.values.number,
        cvc: value.values.cvc,
        expiry: value.values.expiry,
      };
      this.props.enableAddCreditCardButton(true);
    } else {
      this.props.enableAddCreditCardButton(false);
    }
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
              value={this.props.cardEmail}
              style={styles.input}
              placeholder="Email Address"
              onChangeText={(text) => {
                this.props.setCardEmail(text);
                this.setState({error: ''});
              }}
            />
          </View>
        </View>
        <View style={styles.flexContainer} />
        <View style={styles.noteChargesContainer}>
          <Text style={styles.noteChargesText}>
            Dan sako will charge your account #50 a small amount to confirm your
            card details. this amount will serve as discount for your first
            delivery when you use the card.
          </Text>
          <Text style={styles.learnMoreText}>Learn More</Text>
        </View>

        <Text />
        <Button
          onPress={() => this.addCard(this.validCard)}
          disabled={
            !this.props.addCardEnabled ||
            this.props.addCreditCardStatus ===
              AddCreditCard.ADD_CREDEIT_CARD_STARTED
          }
          iconLeft
          large
          rounded
          block
          style={[
            {
              backgroundColor: this.props.addCardEnabled
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
            Add Card
          </Text>
          {this.props.addCreditCardStatus ===
            AddCreditCard.ADD_CREDEIT_CARD_STARTED && (
            <SpinKit type="Circle" color="#fff" />
          )}
        </Button>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchStateToProps)(CreditCard);
