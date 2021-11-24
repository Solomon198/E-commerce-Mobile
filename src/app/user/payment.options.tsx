import React from 'react';
import {View, StyleSheet, Alert, Modal} from 'react-native';
import {
  H1,
  Container,
  Body,
  Text,
  Icon,
  Header,
  Button,
  ListItem,
  Left,
  Radio,
} from 'native-base';
import Colors from '../../configs/styles/index';
import {Navigation} from 'react-native-navigation';
import {connect} from 'react-redux';
import NavigationScreens from '../../../nav.config/navigation.screens';
import {RemoveCreditCard, GetCreditCards} from '../../configs/global.enum';
import User from '../types/user';
import SpinKit from 'react-native-spinkit';
import brandColors from '../../configs/styles/brand.colors';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  removingCardModalLoader: {
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    opacity: 0.8,
  },
  spinKitModalLoader: {marginRight: 10},
  removingCardText: {
    marginTop: 10,
    fontFamily: 'sans-serif-thin',
  },
  head: {backgroundColor: '#fff'},
  headerLeft: {maxWidth: 50},
  pageTitle: {fontWeight: 'bold', marginVertical: 20, marginLeft: 20},
  flexContainer: {
    flex: 1,
  },
  itemStaticCashOption: {marginVertical: 10},
  itemStaticCashIcon: {color: '#999', fontSize: 23},
  listItemLeftIcon: {color: '#999', fontSize: 23},
  initLoader: {alignSelf: 'center', marginTop: 20},
});

type CreditCardInfo = {
  // will be in the sanitized and formatted form
  number: string;
  expiry: string;
  cvc: string;
};
type Props = {
  componentId: string;
  paymentMethod: string;
  selectedCard: any;
  userCards: any;
  paymentOptionsRenderer: number;
  addCreditCardStatus: string;
  user: User;
  getCreditCardStatus: string;
  removeCreditCardStatus: string;
  changePaymentOption: (payload: any, card: any) => void;
  RemoveValidCard: (card: any) => void;
  getCreditCards: (userId: string) => void;
};

const mapStateToProps = (store: any) => ({
  paymentMethod: store.User.paymentMethod,
  userCards: store.User.userCards,
  getCreditCardStatus: store.User.getCreditCardStatus,
  user: store.Auth.user,
  selectedCard: store.User.selectedCard,
  paymentOptionsRenderer: store.User.paymentOptionsRenderer,
});

const mapDispatchStateToProps = (dispatch: any) => ({
  getCreditCards: (userId: string) =>
    dispatch({type: GetCreditCards.GET_CREDIT_CARD_CALLER, payload: userId}),
  changePaymentOption: (payload: any, card: any) =>
    dispatch({type: 'DO-CHANGE-PAYMENT-METHOD', payload: payload, card: card}),
  RemoveValidCard: (card: any) =>
    dispatch({
      type: RemoveCreditCard.REMOVE_CREDIT_CARD_CALLER,
      card,
    }),
});

class PaymentOptions extends React.Component<Props> {
  state = {
    cardNumber: '',
  };
  addCreditCard() {
    Navigation.push(this.props.componentId, {
      component: {
        name: NavigationScreens.CREDIT_CARD,
        id: NavigationScreens.CREDIT_CARD,
      },
    });
  }

  maskCard(card: string) {
    let cardArr = card.split('');
    let cardLen = cardArr.length;
    let startIndex = 4;
    let endIndex = cardLen - 5;
    for (let i = startIndex; i <= endIndex; i++) {
      cardArr[i] = '*';
    }
    return cardArr.join('');
  }

  removeItem(card: any) {
    Alert.alert('Remove Card', 'Are you sure you want to remove Card ?', [
      {
        onPress: () =>
          this.setState(
            {
              cardNumber: card.cardNumber,
            },
            () => {
              this.props.RemoveValidCard(card);
            },
          ),
        text: 'REMOVE CARD',
      },
      {
        onPress: () => '',
        text: 'CANCEL',
      },
    ]);
  }

  removingModal() {
    return (
      <Modal
        transparent
        visible={
          this.props.removeCreditCardStatus ===
          RemoveCreditCard.REMOVE_CREDEIT_CARD_STARTED
        }>
        <View style={styles.removingCardModalLoader}>
          <SpinKit
            type="Circle"
            size={150}
            style={styles.spinKitModalLoader}
            color={brandColors.brandColor}
          />
          <H1 style={styles.removingCardText}>Removing Card ...</H1>
        </View>
      </Modal>
    );
  }
  goBack() {
    Navigation.pop(this.props.componentId);
  }

  componentDidMount() {
    this.props.getCreditCards(this.props.user.userId);
  }

  render() {
    return (
      <Container style={styles.mainContainer}>
        {this.removingModal()}
        <Header
          androidStatusBarColor={Colors.Brand.brandColor}
          hasTabs
          style={styles.head}>
          <Left style={styles.headerLeft}>
            <Button onPress={() => this.goBack()} dark transparent>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body />
        </Header>
        <View style={styles.flexContainer}>
          <H1 style={styles.pageTitle}>Payments</H1>
          <ListItem
            onPress={() => this.props.changePaymentOption('cash', {})}
            noBorder
            noIndent
            style={styles.itemStaticCashOption}>
            <Icon
              style={styles.itemStaticCashIcon}
              type="FontAwesome5"
              name="money-bill"
            />
            <Body>
              <Text>Cash</Text>
            </Body>
            <Radio
              onPress={() => this.props.changePaymentOption('cash', {})}
              selectedColor={Colors.Brand.brandColor}
              color={Colors.Brand.brandColor}
              selected={this.props.paymentMethod === 'cash'}
            />
          </ListItem>
          {this.props.userCards ? (
            <ListItem
              onPress={() =>
                this.props.changePaymentOption('card', this.props.userCards)
              }
              noBorder
              noIndent>
              <Icon
                style={styles.listItemLeftIcon}
                type="FontAwesome5"
                name="credit-card"
              />
              <Body>
                <Text>{this.maskCard(this.props.userCards.cardNumber)}</Text>
              </Body>

              <Radio
                onPress={() =>
                  this.props.changePaymentOption('card', this.props.userCards)
                }
                selected={this.props.paymentMethod === 'card'}
                selectedColor={Colors.Brand.brandColor}
                color={Colors.Brand.brandColor}
              />
            </ListItem>
          ) : null}
          {!this.props.userCards ? (
            <ListItem onPress={() => this.addCreditCard()} noBorder noIndent>
              <Icon style={styles.listItemLeftIcon} name="add" />
              <Body>
                <Text>Add Credit Card</Text>
              </Body>
            </ListItem>
          ) : null}
          {this.props.getCreditCardStatus ===
            GetCreditCards.GET_CREDEIT_CARD_STARTED && (
            <SpinKit
              style={styles.initLoader}
              type="Circle"
              color={brandColors.brandColor}
              size={40}
            />
          )}
        </View>

        {this.props.userCards ? (
          <Button
            onPress={() => this.removeItem(this.props.userCards)}
            iconLeft
            danger
            transparent
            block>
            <Icon name="delete" type="MaterialCommunityIcons" />
            <Text uppercase={false}>Remove Card</Text>
          </Button>
        ) : null}
      </Container>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchStateToProps,
)(PaymentOptions);
