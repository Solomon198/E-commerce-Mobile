import React from 'react';
import {StyleSheet, FlatList} from 'react-native';
import {
  Container,
  Input,
  Fab,
  Icon,
  ListItem,
  Left,
  H1,
  Button,
} from 'native-base';
import Brand from '../../configs/styles/index';
import {toggleSideMenu} from './navigations.actions';
import {Navigation} from 'react-native-navigation';
import {connect} from 'react-redux';
import SpinKit from 'react-native-spinkit';
import {
  cancelDeliveryActionType,
  confirmDeliveryActionType,
  currentLocation,
  GetUserPosts,
  inputActionType,
  setLocation,
} from '../../configs/global.enum';
import NavigationScreens from '../../../nav.config/navigation.screens';
import User from '../types/user';
import {Driver} from '../types/driver';
import {Avatar} from 'react-native-ui-lib';
import _ from 'lodash';
import {ScrollView} from 'react-native';
import {Colors, View, Card, Text} from 'react-native-ui-lib';
import firestore from '@react-native-firebase/firestore';
// @ts-ignore
import posts from './_mock_data_/posts';
import {
  formatAmountWithComma,
  getDefaultProfilePicture,
} from '../utilities/helper.funcs';

const mapStateToProps = (store: any) => ({
  userPosts: store.User.userPosts,
  userPostStatus: store.User.userPostStatus,
  userPostError: store.User.userPostError,
  user: store.Auth.user,
});

const mapDispatchStateToProps = (dispatch: any) => ({
  getUserPost: (userId: string) =>
    dispatch({type: GetUserPosts.GET_USER_POSTS_CALLER, payload: userId}),
});

type currentLocationObj = {
  name: string;
  longitude: number;
  latitude: number;
  address: string;
};

type parcelInProgress = {
  distance: number;
  parcelLocation: number[];
  parcelOwner: string;
  parcelPicker: string;
  date: any;
  parcelPrice: number;
  parcelStatus: number;
  user: User;
  parcelDestinationPhysicalAddress: string;
  parcelLocationPhysicalAddress: string;
  parcelDestination: number[];
  passengerPhoneNumber: string;
  driver: any;
  id: string;
};

type coords = {longitude: number; latitude: number};

type Props = {
  user: User;
  userPosts: any[];
  userPostStatus: string;
  userPostError: string;
  componentId: string;
  getUserPost: (userId: string) => void;
};

const styles = StyleSheet.create({
  searchingTextStyle: {marginVertical: 5},
  spinKitContainer: {
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  flatList: {maxHeight: 150},
  retryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  retryBtn: {
    backgroundColor: Brand.Brand.brandColor,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  fab: {
    backgroundColor: '#fff',
  },
  currentLocationSelect: {
    backgroundColor: Brand.Brand.brandColor,
    marginVertical: 10,
    borderColor: 'transparent',
  },
  ico: {
    fontSize: 20,
    color: '#888',
  },
  descLocation: {
    fontWeight: 'bold',
    color: '#555',
    fontSize: 19,
    marginBottom: 10,
  },
  enlargeIndicator: {
    width: 50,
    height: 5,
    backgroundColor: '#e8e8e8',
    borderRadius: 50,
    marginVertical: 8,
    alignSelf: 'center',
  },
  suggestion: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 15,
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  subContainer: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: Brand.Brand.brandColor,
    zIndex: 2000,
  },
  btnMenu: {
    backgroundColor: Brand.Brand.brandColor,
    width: 50,
    height: 50,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  container: {
    flex: 1,
  },
  map: {
    flex: 4,
    zIndex: -10,
  },
  locationString: {
    fontSize: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Brand.Brand.brandColor,
  },
  left: {
    maxWidth: 30,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  avatar: {
    marginLeft: -10,
  },
  driverMarker: {
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  driverMarkerIcon: {color: '#5cb85c'},
  imgUserLocation: {width: 30, height: 30},
  driverNameStyle: {marginLeft: 10},
  parcelPicked: {
    color: '#d9534f',
    fontWeight: 'bold',
    fontSize: 10,
  },
  inProgressText: {
    color: '#f0ad4e',
    fontWeight: 'bold',
    fontSize: 10,
  },
  deliveredParcel: {
    color: '#5cb85c',
    fontWeight: 'bold',
    fontSize: 10,
  },
  icoDanger: {color: Brand.Brand.danger},
  icoWarning: {color: Brand.Brand.warning},
  icoSuccess: {color: Brand.Brand.success},
  fabCancelDelivery: {backgroundColor: '#d9534f', zIndex: 100000},
  icoWhite: {color: '#fff'},
  fabSuccessDelivery: {backgroundColor: '#5cb85c', zIndex: 100000},
  welcomeText: {fontSize: 10},
  inputSearchLocation: {
    borderBottomColor: 'transparent',
    backgroundColor: '#f4f4f4',
    paddingLeft: 10,
    borderRadius: 50,
  },
  searchIcon: {color: '#999'},
  pickUpLocationCaption: {color: '#555', fontWeight: 'bold'},
  modalSubContainer: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  modal: {
    flex: 1,
    backgroundColor: '#f3f3f3',
  },
  available: {
    fontFamily: 'sans-serif-thin',
    marginTop: 20,
  },
});

type CardsScreenProps = {};
type CardsScreenState = {
  selected1: boolean;
  selected2: boolean;
};

class CustomersOrders extends React.Component<Props> {
  watchChanges: any;
  componentDidMount() {
    this.watchChanges = firestore()
      .collection('Orders')
      .where('sellerId', '==', this.props.user.userId)
      .onSnapshot((snapshot) => {
        if (!snapshot.empty) {
          const docArray: any[] = [];
          snapshot.forEach((doc) => {
            let data = doc.data();
            docArray.push(data);
          });
          this.setState({orders: docArray});
        }
      });
  }

  componentWillUnmount() {
    try {
      if (this.watchChanges) {
        this.watchChanges();
      }
    } catch {}
  }

  state = {
    isLoading: false,
    orders: [],
  };
  render() {
    return (
      <Container style={styles.mainContainer}>
        <View style={{flexDirection: 'row', padding: 10}}>
          <View style={{maxWidth: 100}}>
            <Avatar
              onPress={() => ''}
              size={50}
              source={
                this.props.user.photo
                  ? {uri: this.props.user.photo}
                  : getDefaultProfilePicture(this.props.user.gender)
              }
            />
          </View>
          <View style={{justifyContent: 'center', marginHorizontal: 10}}>
            <Text style={{fontWeight: 'bold', fontSize: 18, color: '#555'}}>
              Customers Orders
            </Text>
          </View>
        </View>
        <View style={{marginTop: 5}} />
        {this.state.isLoading ? (
          <View
            style={{
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
              marginVertical: 10,
            }}>
            <SpinKit type="Circle" />
          </View>
        ) : null}

        <FlatList
          ListEmptyComponent={() =>
            !this.state.isLoading ? (
              <View>
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: '#555',
                    alignSelf: 'center',
                    marginTop: 200,
                    fontSize: 18,
                    marginHorizontal: 20,
                    textAlign: 'center',
                  }}>
                  You have no orders yet. make more post of what you sell to
                  attract more buyers.
                </Text>
              </View>
            ) : null
          }
          data={this.state.orders}
          renderItem={({item, index}) => (
            <Card
              key={index}
              style={{marginBottom: 15, marginHorizontal: 5}}
              onPress={() => console.log('press on a card')}>
              <Card.Section
                imageSource={{uri: item.coverImage}}
                imageStyle={{height: 270}}
              />

              {/* <View padding-15 bg-white>
                <Text text60 color={Colors.grey10}>
                  {item.title}
                </Text>

                <Text
                  marginT
                  numberOfLines={3}
                  ellipsizeMode="tail"
                  text80
                  color={Colors.grey10}>
                  {item.description}
                </Text>
              </View> */}
              <Text
                style={{
                  fontWeight: 'bold',
                  marginLeft: 20,
                  color: '#999',
                }}>
                Customer Contact
              </Text>
              <View
                style={{
                  marginHorizontal: 20,
                  flexDirection: 'row',
                  marginTop: 10,
                }}>
                <View>
                  <Avatar
                    onPress={() => ''}
                    size={50}
                    source={
                      item.customer.photo
                        ? {uri: item.customer.photo}
                        : getDefaultProfilePicture(this.props.user.gender)
                    }
                  />
                </View>
                <View style={{marginLeft: 10}}>
                  <Text style={{fontWeight: 'bold', fontSize: 15}}>
                    {item.customer.firtName} {item.customer.lastName}
                  </Text>
                  <Text>{item.customer.phoneNumber}</Text>
                </View>
              </View>
              <View
                row
                style={{
                  marginBottom: 10,
                  marginHorizontal: 20,
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <Text
                  style={{fontWeight: 'bold', marginRight: 10, fontSize: 25}}>
                  ₦{formatAmountWithComma(item.price)}
                </Text>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 30,
                    width: 30,
                    marginLeft: 10,
                    borderColor: 'lightgray',
                    borderWidth: 1,
                    borderRadius: 100,
                    marginRight: 10,
                  }}>
                  <Text style={{fontWeight: 'bold', color: 'dark'}}>
                    {item.count}
                  </Text>
                </View>
              </View>
            </Card>
          )}
        />
      </Container>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchStateToProps,
)(CustomersOrders);
