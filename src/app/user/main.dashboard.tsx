import React from 'react';
import {
  RefreshControl,
  StyleSheet,
  FlatList,
  Modal,
  TouchableOpacity,
} from 'react-native';
import {
  Container,
  Input,
  Fab,
  Icon,
  ListItem,
  Left,
  H1,
  Button,
  Text as NativeBaseText,
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
  GetCategories,
  GetFeeds,
  inputActionType,
  Post,
  setLocation,
  AddCart,
} from '../../configs/global.enum';
import NavigationScreens from '../../../nav.config/navigation.screens';
import User from '../types/user';
import {Driver} from '../types/driver';

import _ from 'lodash';
import {ScrollView} from 'react-native';
import {Colors, View, Card, Text} from 'react-native-ui-lib';
// @ts-ignore
import posts from '../user/_mock_data_/posts';
import {formatAmountWithComma} from '../utilities/helper.funcs';
import {Picker} from 'react-native-ui-lib';
import {TextInput} from 'react-native-gesture-handler';

const mapStateToProps = (store: any) => ({
  currentLocationPrediction: store.User.currentLocation,
  currentLocationStatus: store.User.currentLocationStatus,
  user: store.Auth.user,
  activeDelivery: store.User.activeDelivery,
  driver: store.User.driver,
  cancelDeliveryStatus: store.User.cancelDeliveryStatus,
  confirmDeliveryStatus: store.User.confirmDeliveryStatus,
  watchPosition: store.User.watchPosition,
  deliveryDeleted: store.User.deliveryDeleted,
  page: store.User.page,
  feeds: store.User.feeds,
  feedStatus: store.User.feedStatus,
  hasNextPage: store.User.hasNextPage,
  categories: store.User.categories,
  carts: store.User.carts,
});

const mapDispatchStateToProps = (dispatch: any) => ({
  getCurrentLocation: () =>
    dispatch({type: currentLocation.GET_CUURENT_LOCATION_CALLER}),
  selectedLocation: (location: any) =>
    dispatch({
      type: setLocation.SET_LOCATION_CALLER,
      currentLocation: location,
    }),
  setActiveDelivery: (payload: any, driver: any, discard?: boolean) =>
    dispatch({
      type: inputActionType.SET_TRACK_ACTIVE_DELIVERY_CALLER,
      payload,
      driver,
      discard,
    }),
  cancelDelivery: (parcelId: string) =>
    dispatch({
      type: cancelDeliveryActionType.CANCEL_DELIVERY_CALLER,
      payload: parcelId,
    }),
  confirmDelivery: (parcelId: string) =>
    dispatch({
      type: confirmDeliveryActionType.CONFIRM_DELIVERY_CALLER,
      payload: parcelId,
    }),
  setCurrentLocation: (location: coords) =>
    dispatch({
      type: inputActionType.SET_USER_CURRENT_LOCATION_CALLER,
      payload: location,
    }),
  getCategories: () => dispatch({type: GetCategories.GET_CATEGORIES_CALLER}),
  getFeeds: (queryParams: any, isRefresh?: boolean) =>
    dispatch({type: GetFeeds.GET_FEEDS_CALLER, queryParams, isRefresh}),
  addToCart: (payload: any, isAdding: boolean) =>
    dispatch({type: AddCart.ADD_TO_CART_CALLER, payload, isAdding}),
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
  parcelDestinationPhysicalAddress: string;
  parcelLocationPhysicalAddress: string;
  parcelDestination: number[];
  passengerPhoneNumber: string;
  driver: any;
  id: string;
};
type coords = {longitude: number; latitude: number};

type Props = {
  componentId: string;
  currentLocationPrediction: currentLocationObj[];
  currentLocationStatus: string;
  activeDelivery: parcelInProgress;
  user: User;
  driver: Driver;
  cancelDeliveryStatus: string;
  confirmDeliveryStatus: string;
  watchPosition: coords;
  deliveryDeleted: boolean;
  page: number;
  feeds: any[];
  feedStatus: string;
  categories: any[];
  hasNextPage: boolean;
  carts: any[];
  getFeeds: (queryParams: any, isRefresh?: boolean) => void;
  addToCart: (payload: any, isAdding: boolean) => void;
  getCategories: () => void;
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

class Dashboard extends React.Component<Props> {
  state = {
    category: {value: '', label: ''},
    showModal: false,
    budget: 0,
    showCart: false,
  };
  componentDidMount() {
    this.props.getCategories();
    this.props.getFeeds({pageSize: 10, pageNumber: 1}, true);
  }

  getTotalSum() {
    let total: number = 0;
    this.props.carts.forEach((item) => {
      total += parseInt(item.price) * item.count; // eslint-disable-line
    });
    return total;
  }

  getTotalAmountInCart() {
    let count: number = 0;
    const carts = this.props.carts || [];
    carts.forEach((item) => {
      count += item.count;
    });
    return count;
  }

  getItemCount(id: any) {
    let count = 0;
    this.props.carts.forEach((item) => {
      if (item.postId == id) {
        count = item.count;
      }
    });

    return count;
  }

  renderCart() {
    return (
      <Modal
        visible={this.state.showCart}
        onRequestClose={() => this.setState({showCart: false})}
        style={{flex: 1, backgroundColor: '#fff'}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginHorizontal: 10,
          }}>
          <Icon style={{color: 'gray'}} type="Feather" name="shopping-cart" />

          <TouchableOpacity
            onPress={() => this.setState({showCart: false})}
            style={{
              width: 60,
              height: 60,
              borderRadius: 100,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'whitesmoke',
              margin: 10,
              alignSelf: 'flex-end',
            }}>
            <Icon name="close" />
          </TouchableOpacity>
        </View>
        <FlatList
          ListEmptyComponent={
            <View
              style={{
                marginTop: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{fontWeight: 'bold', marginTop: 150}}>
                OOps there are no items !!
              </Text>
            </View>
          }
          data={this.props.carts}
          renderItem={({item, index}) => (
            <Card
              key={index}
              style={{marginBottom: 15, marginHorizontal: 5}}
              onPress={() => console.log('press on a card')}>
              <Card.Section
                imageSource={{uri: item.coverImage}}
                imageStyle={{height: 270}}
              />

              <View padding-15 bg-white>
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
              </View>
              <View
                row
                style={{
                  marginBottom: 10,
                  marginHorizontal: 20,
                  alignItems: 'center',
                }}>
                <Text
                  style={{fontWeight: 'bold', marginRight: 10, fontSize: 25}}>
                  ₦{formatAmountWithComma(item.price)}
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <Button
                    rounded
                    onPress={() => this.props.addToCart(item, true)}
                    style={{paddingVertical: 15, paddingHorizontal: 8}}
                    small
                    success
                    iconLeft
                    bordered>
                    <Icon type="Feather" name="shopping-cart" />
                    <Text style={{fontSize: 20, marginLeft: 10}}>+</Text>
                  </Button>
                  <Button
                    onPress={() => this.props.addToCart(item, false)}
                    rounded
                    style={{
                      paddingVertical: 15,
                      paddingHorizontal: 8,
                      marginLeft: 10,
                    }}
                    small
                    success
                    iconLeft
                    bordered>
                    <Icon type="Feather" name="shopping-cart" />
                    <Text style={{fontSize: 20, marginLeft: 10}}>-</Text>
                  </Button>
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
                    }}>
                    <Text style={{fontWeight: 'bold'}}>
                      {this.getItemCount(item.postId)}
                    </Text>
                  </View>
                </View>
              </View>
            </Card>
          )}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingVertical: 10,
          }}>
          <View>
            <Text style={{fontSize: 30, fontWeight: 'bold', color: '#444'}}>
              ₦{formatAmountWithComma(this.getTotalSum())}
            </Text>
          </View>
          <Button
            onPress={() =>
              this.setState(
                {
                  showCart: false,
                },
                () => {
                  Navigation.push(this.props.componentId, {
                    component: {
                      id: NavigationScreens.CREDIT_CARD,
                      name: NavigationScreens.CREDIT_CARD,
                    },
                  });
                },
              )
            }
            style={{borderRadius: 10}}
            rounded
            disabled={this.props.carts.length < 1}
            light>
            <NativeBaseText uppercase={false}>Checkout</NativeBaseText>
          </Button>
        </View>
      </Modal>
    );
  }

  renderModal() {
    const formatCategories = this.props.categories.map((category) => ({
      label: category.name,
      value: category.categoryId,
    }));
    return (
      <Modal
        visible={this.state.showModal}
        onRequestClose={() => this.setState({showModal: false})}
        animationType="slide">
        <TouchableOpacity
          onPress={() => this.setState({showModal: false})}
          style={{
            width: 60,
            height: 60,
            borderRadius: 100,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'whitesmoke',
            margin: 10,
            alignSelf: 'flex-end',
          }}>
          <Icon name="close" />
        </TouchableOpacity>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            padding: 20,
          }}>
          <Text style={{fontSize: 20, fontWeight: 'bold', color: '#888'}}>
            Search by Category and budget
          </Text>
          <Text style={{marginTop: 3, color: '#444'}}>
            you can get anything you want base on what you are looking for and
            how much money you have, lets go!
          </Text>
          <View style={{flexGrow: 1, marginHorizontal: 10, marginTop: 15}}>
            <Picker
              placeholder="Filter by category "
              floatingPlaceholder
              value={this.state.category}
              style={{marginLeft: 20, width: '100%'}}
              enableModalBlur={false}
              onChange={(item) => this.setState({category: item})}
              topBarProps={{title: 'Categories'}}
              showSearch
              searchPlaceholder={'Search a category'}
              searchStyle={{
                color: Colors.blue30,
                placeholderTextColor: Colors.grey50,
              }}>
              {_.map(formatCategories, (option) => (
                <Picker.Item
                  key={option.value}
                  value={option}
                  disabled={false}
                />
              ))}
            </Picker>

            <TextInput
              keyboardType="numeric"
              value={this.state.budget + ''}
              onChangeText={(text) => this.setState({budget: text})}
              style={{
                borderBottomColor: 'lightgray',
                borderBottomWidth: 1,
                borderRadius: 10,
              }}
              placeholder="Filter by price"
            />

            <Button
              onPress={() => {
                this.setState({showModal: false}, () => {
                  const $queryParams: any = {
                    pageSize: 1000,
                    pageNumber: 1,
                    category: this.state.category.value,
                  };
                  /* eslint-disable */
                  if (parseInt(this.state.budget + '') > 0) {
                    $queryParams['budget'] = this.state.budget;
                  }
                  this.props.getFeeds($queryParams, true);
                });
              }}
              block
              light
              style={{borderRadius: 10, marginTop: 40}}>
              <NativeBaseText>Search</NativeBaseText>
            </Button>
          </View>
          <View style={{flex: 1, marginRight: 5}}></View>
        </View>
      </Modal>
    );
  }

  render() {
    const isLoading = this.props.feedStatus === GetFeeds.GET_FEEDS_STARTED;
    this.props.feeds.forEach((val, index) => {
      console.log(
        index,
        '=-==========================================================================',
      );
      console.log(val);
    });
    return (
      <Container style={styles.mainContainer}>
        {this.renderModal()}
        {this.renderCart()}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            margin: 10,
          }}>
          <Button
            style={{
              paddingVertical: 15,
              paddingHorizontal: 8,
              marginRight: 20,
              paddingRight: 10,
            }}
            onPress={() => this.setState({showCart: true})}
            success
            bordered
            rounded
            icon>
            <Icon type="Feather" name="shopping-cart" />
            <Text style={{marginLeft: -10, fontWeight: 'bold'}}>
              {this.getTotalAmountInCart()}
            </Text>
          </Button>
          <Button
            light
            bordered
            onPress={() => this.setState({showModal: true})}
            rounded
            style={{
              zIndex: 1000,
            }}>
            <NativeBaseText uppercase={false}>Search</NativeBaseText>
            <Icon name="search" />
          </Button>
        </View>
        <View style={{marginTop: 15}} />

        <FlatList
          extraData={new Date().getTime()}
          ListEmptyComponent={
            <View
              style={{
                marginTop: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{fontWeight: 'bold', marginTop: 150}}>
                OOps there are no items !!
              </Text>
            </View>
          }
          ListFooterComponent={
            isLoading && this.props.feeds.length > 10 ? (
              <View
                style={{
                  justifyContent: 'center',
                  alignContent: 'center',
                  alignItems: 'center',
                  marginVertical: 10,
                }}>
                <SpinKit type="Circle" />
              </View>
            ) : null
          }
          refreshControl={
            <RefreshControl
              onRefresh={() =>
                this.props.getFeeds({pageSize: 10, pageNumber: 1}, true)
              }
              refreshing={isLoading}
            />
          }
          data={this.props.feeds}
          onEndReached={() => {
            if (this.props.hasNextPage && !isLoading) {
              this.props.getFeeds(
                {pageSize: 10, pageNumber: this.props.page},
                false,
              );
            }
          }}
          onEndReachedThreshold={0.5}
          renderItem={({item, index}) => (
            <Card
              key={index}
              style={{marginBottom: 15, marginHorizontal: 5}}
              onPress={() => console.log('press on a card')}>
              <Card.Section
                imageSource={{uri: item.coverImage}}
                imageStyle={{height: 270}}
              />

              <View padding-15 bg-white>
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
              </View>
              <View
                row
                style={{
                  marginBottom: 10,
                  marginHorizontal: 20,
                  alignItems: 'center',
                }}>
                <Text
                  style={{fontWeight: 'bold', marginRight: 10, fontSize: 25}}>
                  ₦{formatAmountWithComma(item.price)}
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <Button
                    rounded
                    onPress={() => this.props.addToCart(item, true)}
                    style={{paddingVertical: 15, paddingHorizontal: 8}}
                    small
                    success
                    iconLeft
                    bordered>
                    <Icon type="Feather" name="shopping-cart" />
                    <Text style={{fontSize: 20, marginLeft: 10}}>+</Text>
                  </Button>
                  <Button
                    onPress={() => this.props.addToCart(item, false)}
                    rounded
                    style={{
                      paddingVertical: 15,
                      paddingHorizontal: 8,
                      marginLeft: 10,
                    }}
                    small
                    success
                    iconLeft
                    bordered>
                    <Icon type="Feather" name="shopping-cart" />
                    <Text style={{fontSize: 20, marginLeft: 10}}>-</Text>
                  </Button>
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
                    }}>
                    <Text style={{fontWeight: 'bold'}}>
                      {this.getItemCount(item.postId)}
                    </Text>
                  </View>
                </View>
              </View>
            </Card>
          )}
        />

        <Fab
          active={true}
          style={styles.fab}
          position="topLeft"
          onPress={() => toggleSideMenu(true, this.props.componentId)}>
          <Icon style={{color: Brand.Brand.brandColor}} name="menu" />
        </Fab>
        <Fab
          active={true}
          style={styles.fab}
          style={{backgroundColor: Brand.Brand.brandColor}}
          position="bottomRight"
          onPress={() =>
            Navigation.push(this.props.componentId, {
              component: {
                id: NavigationScreens.CREATE_PARCEL_SCREEN,
                name: NavigationScreens.CREATE_PARCEL_SCREEN,
              },
            })
          }>
          <Icon style={{color: '#fff'}} name="md-add-outline" />
        </Fab>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchStateToProps)(Dashboard);
