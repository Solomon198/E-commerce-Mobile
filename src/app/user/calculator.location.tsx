import React from 'react';
import {View, StyleSheet, Image, Dimensions} from 'react-native';
import {
  Container,
  Body,
  H3,
  Fab,
  Text,
  Icon,
  Button,
  ListItem,
} from 'native-base';
import Colors from '../../configs/styles/index';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import {Navigation} from 'react-native-navigation';
import {connect} from 'react-redux';
import MapViewDirections from 'react-native-maps-directions';
import {inputActionType} from '../../configs/global.enum';
import NavigationScreens from '../../../nav.config/navigation.screens';
import {API_KEY} from 'react-native-dotenv';
import crashlytics from '@react-native-firebase/crashlytics';

const {width} = Dimensions.get('window');

type locationDetails = {
  name: string;
  address: string;
  location: {
    longitude: number;
    latitude: number;
  };
};

type variables = {
  radiusOfMatch: number;
  amountPerKm: number;
};

type Props = {
  componentId: string;
  pickUpLocation: locationDetails;
  pickUpDestination: locationDetails;
  directionInfo: {duration: number; distance: number};
  paymentMethod: string;
  variables: variables;
  setDurationAndDistance: (info: any) => void;
};

const mapStateToProps = (store: any) => ({
  pickUpLocation: store.User.pickUpLocation,
  pickUpDestination: store.User.pickUpDestination,
  directionInfo: store.User.directionInfo,
  paymentMethod: store.User.paymentMethod,
  variables: store.User.variables,
});

const styles = StyleSheet.create({
  icoCharge: {
    fontSize: 16,
  },
  icoList: {
    color: '#999',
    fontSize: 23,
  },
  price: {
    fontWeight: '900',
    color: '#555',
  },
  minutes: {
    color: Colors.Brand.brandColor,
    fontSize: 10,
  },
  listBody: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },
  icoConfirm: {color: '#fff'},
  confirmPickUpBtn: {
    backgroundColor: Colors.Brand.brandColor,
    marginHorizontal: 15,
  },
  confirmPickUpText: {
    fontWeight: '900',
    letterSpacing: 2,
  },
  fab: {backgroundColor: '#fff'},
  tripInfoContainer: {
    width: 100,
    height: 40,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  ListItem: {
    borderColor: 'transparent',
    marginBottom: 10,
    borderRadius: 50,
    marginVertical: 10,
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100000000,
  },

  modal1: {
    height: 230,
    backgroundColor: '#3B5998',
  },
  img: {
    width: width / 4,
    height: 40,
  },
  durationEmpty: {
    backgroundColor: 'transparent',
    flex: 2,
    width: 200,
  },
  imagesContainer: {
    flexDirection: 'row',
  },
  locationName: {
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  locationNameContainer: {
    flex: 2,
    borderRadius: 5,
    backgroundColor: '#fff',
    height: 40,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    paddingLeft: 5,
  },
  duration: {
    color: '#fff',
    fontWeight: 'bold',
  },
  destinationTitleContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: 150,
    marginLeft: 30,
    height: 40,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  currentLocationSelect: {
    backgroundColor: Colors.Brand.brandColor,
    marginVertical: 10,
    borderColor: 'transparent',
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
    paddingHorizontal: 20,
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
    backgroundColor: Colors.Brand.brandColor,
    zIndex: 2000,
  },
  btnMenu: {
    backgroundColor: Colors.Brand.brandColor,
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
});

const mapDispatchStateToProps = (dispatch: any) => ({
  setDurationAndDistance: (info: any) =>
    dispatch({
      type: inputActionType.SET_DURATION_AND_DISTANCE_CALLER,
      payload: info,
    }),
});

class CalculatorParcel extends React.Component<Props> {
  state = {
    variables: {amountPerKm: 0},
  };

  origin: any;
  destination: any;
  mapRef: any;

  componentDidMount() {}

  componentWillUnmount() {}

  callFit(result: any) {
    this.props.setDurationAndDistance({
      duration: result.duration,
      distance: parseFloat(result.distance.toFixed()),
    });

    let timer = setTimeout(() => {
      this.mapRef.fitToCoordinates([this.origin, this.destination], {
        edgePadding: {
          bottom: 200,
          right: 50,
          top: 150,
          left: 50,
        },
        animated: false,
      });
      clearTimeout(timer);
    }, 4000);
  }

  componentDidUpdate() {
    this.mapRef.fitToCoordinates([this.origin, this.destination], {
      edgePadding: {
        bottom: 200,
        right: 50,
        top: 150,
        left: 50,
      },
      animated: false,
    });
  }

  selectPaymentOption() {
    Navigation.push(this.props.componentId, {
      component: {
        name: NavigationScreens.PAYMENT_OPTION_SCREEN,
      },
    });
  }

  searchPickUp() {
    Navigation.push(this.props.componentId, {
      component: {
        name: NavigationScreens.SEARCH_PICKUP_SCREEN,
        id: NavigationScreens.SEARCH_PICKUP_SCREEN,
        passProps: {
          variables: this.state.variables,
        },
      },
    });
  }

  getCoords(obj: locationDetails) {
    try {
      let lng = obj.location.longitude;
      let ltd = obj.location.latitude;
      return {
        latitude: ltd,
        longitude: lng,
      };
    } catch (e) {
      crashlytics().log('could not get users location');
      crashlytics().recordError(e);
      return {
        latitude: 0.28,
        longitude: 0.2992,
      };
    }
  }

  render() {
    const origin = this.getCoords(this.props.pickUpLocation);
    this.origin = origin;
    const destination = this.getCoords(this.props.pickUpDestination);
    this.destination = destination;
    return (
      <Container style={styles.mainContainer}>
        <View style={styles.container}>
          <MapView
            ref={(ref) => {
              this.mapRef = ref;
            }}
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={styles.map}
            showsCompass={true}
            region={{
              ...origin,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            initialRegion={{
              ...origin,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}>
            <Marker
              title={this.props.pickUpLocation.address}
              coordinate={origin}
              pinColor={Colors.Brand.brandColor}
              key={this.props.pickUpLocation.name}
              identifier={this.props.pickUpLocation.name}
            />

            <Marker
              title={this.props.pickUpDestination.address}
              coordinate={destination}
              key={this.props.pickUpDestination.name}
              identifier={this.props.pickUpDestination.name}
            />

            <MapViewDirections
              onReady={(result) => {
                this.callFit(result);
              }}
              origin={origin}
              destination={destination}
              apikey={API_KEY}
              strokeWidth={3}
              strokeColor={Colors.Brand.brandColor}
            />
          </MapView>
          <View style={styles.suggestion}>
            <View>
              <View style={styles.imagesContainer}>
                <View style={styles.img}>
                  <Image
                    style={[styles.img]}
                    resizeMethod="resize"
                    resizeMode="contain"
                    source={require('../../../assets/media/images/car.png')}
                  />
                </View>
                <View style={styles.img}>
                  <Image
                    style={[styles.img]}
                    resizeMethod="resize"
                    resizeMode="contain"
                    source={require('../../../assets/media/images/bike.png')}
                  />
                </View>
                <View style={styles.img}>
                  <Image
                    style={[styles.img]}
                    resizeMethod="resize"
                    resizeMode="contain"
                    source={require('../../../assets/media/images/keke.png')}
                  />
                </View>
                <View style={styles.img} />
              </View>
              <ListItem
                noIndent
                onPress={() => this.selectPaymentOption()}
                style={styles.ListItem}>
                <Icon
                  style={styles.icoList}
                  type="FontAwesome5"
                  name="money-bill"
                />
                <Body style={styles.listBody}>
                  {this.props.paymentMethod === 'cash' ? (
                    <Text note>Cash</Text>
                  ) : (
                    <Text note>Charge Card</Text>
                  )}
                  <Icon
                    style={styles.icoCharge}
                    type="Entypo"
                    name="chevron-thin-down"
                  />
                </Body>
                <View style={styles.tripInfoContainer}>
                  <H3 style={styles.price}>
                    ₦
                    {this.props.directionInfo.distance
                      ? this.props.directionInfo.distance *
                        this.props.variables.amountPerKm
                      : ''}
                  </H3>
                  <Text note style={styles.minutes}>
                    {this.props.directionInfo.duration
                      ? this.props.directionInfo.duration.toFixed()
                      : ''}{' '}
                    minutes
                  </Text>
                </View>
              </ListItem>
              <Button
                onPress={() => this.searchPickUp()}
                iconLeft
                rounded
                block
                style={styles.confirmPickUpBtn}>
                <Icon
                  style={styles.icoConfirm}
                  type="FontAwesome5"
                  name="people-carry"
                />
                <Text uppercase={false} style={styles.confirmPickUpText}>
                  Confirm pickup
                </Text>
              </Button>
            </View>
          </View>

          <Fab
            active={true}
            style={styles.fab}
            position="topLeft"
            onPress={() => Navigation.pop(this.props.componentId)}>
            <Icon style={{color: Colors.Brand.brandColor}} name="arrow-back" />
          </Fab>
        </View>
      </Container>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchStateToProps,
)(CalculatorParcel);
