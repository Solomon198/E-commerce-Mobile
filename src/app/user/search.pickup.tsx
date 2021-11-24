import React from 'react';
import {View, StyleSheet, FlatList, Dimensions, Modal} from 'react-native';
import {
  H1,
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
import SpinKit from 'react-native-spinkit';
import * as geoHash from 'geofire-common';
import FireStore from '@react-native-firebase/firestore';
import {Avatar} from 'react-native-ui-lib';
import UserType from '../types/user';
import {createParcel, inputActionType} from '../../configs/global.enum';
const {width, height} = Dimensions.get('window');
import {API_KEY} from 'react-native-dotenv';
import crashlytics from '@react-native-firebase/crashlytics';

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
  user: UserType;
  componentId: string;
  pickUpLocation: locationDetails;
  pickUpDestination: locationDetails;
  directionInfo: {duration: number; distance: number};
  variables: variables;
  locationSearchString: string;
  destinationSearchString: string;
  createParcelStatus: string;
  reAssigning: boolean;
  parcel: any;
  selectedCard: {
    email: string;
    cardNumber: string;
    authorization: string;
    outStandingDiscount: boolean;
  };
  paymentMethod: string;
  setDurationAndDistance: (info: any) => void;
  createParcel: (payload: any) => void;
};

const mapStateToProps = (store: any) => ({
  pickUpLocation: store.User.pickUpLocation,
  pickUpDestination: store.User.pickUpDestination,
  locationSearchString: store.User.locationSearchString,
  destinationSearchString: store.User.destinationSearchString,
  directionInfo: store.User.directionInfo,
  variables: store.User.variables,
  user: store.Auth.user,
  createParcelStatus: store.User.createParcelStatus,
  selectedCard: store.User.selectedCard,
  paymentMethod: store.User.paymentMethod,
});

const mapDispatchStateToProps = (dispatch: any) => ({
  setDurationAndDistance: (info: any) =>
    dispatch({
      type: inputActionType.SET_DURATION_AND_DISTANCE_CALLER,
      payload: info,
    }),
  createParcel: (payload: any) =>
    dispatch({type: createParcel.CREATE_PARCEL_CALLER, payload}),
});

const styles = StyleSheet.create({
  img: {
    width: width / 5,
    height: 100,
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
  durationContainer: {
    backgroundColor: Colors.Brand.brandColor,
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
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
    height: height / 2 - 50,
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
    flex: 3,
    zIndex: -10,
  },
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
  searchingDriverContainer: {
    alignContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  searchingDriverText: {
    color: Colors.Brand.brandColor,
    fontSize: 10,
    marginVertical: 10,
  },
  listEmptyComponent: {
    marginTop: 50,
    alignContent: 'center',
    alignItems: 'center',
  },
  emptyComponentIcon: {color: Colors.Brand.brandColor, fontSize: 40},
  emptyComponentText: {fontFamily: 'sans-serif-thin'},
  noDriverText: {
    alignSelf: 'center',
    fontFamily: 'san-serif-thin',
  },
  btnRetrySearchDriver: {
    backgroundColor: Colors.Brand.brandColor,
    alignSelf: 'center',
    marginTop: 20,
  },
  driverItemName: {marginLeft: 10},
  retryText: {color: '#fff'},
  backFab: {backgroundColor: '#fff'},
});

class SearchPickUp extends React.Component<Props> {
  state = {
    isEmpty: true,
    isLoading: false,
    drivers: [],
  };

  origin: any;
  destination: any;
  mapRef: any;

  requestParcelDelivery(pickerId: string) {
    if (this.props.reAssigning) {
      const parcel = this.props.parcel;
      delete parcel.driverReject;
      delete parcel.userReject;
      delete parcel.date;
      delete parcel.parcelStatus;
      delete parcel.id;
      parcel.parcelPicker = pickerId;
      return this.props.createParcel(parcel);
    }
    let options = {
      userAuthorization:
        this.props.paymentMethod === 'card'
          ? this.props.selectedCard.authorization
          : '',
      transactionType: this.props.paymentMethod === 'cash' ? 0 : 1,
      parcelOwnerPhoneNumber: this.props.user.phoneNumber,
      parcelOwner: this.props.user.userId,
      parcelPicker: pickerId,
      parcelPrice:
        this.props.variables.amountPerKm * this.props.directionInfo.distance,
      distance: this.props.directionInfo.distance,
      parcelDestinationPhysicalAddress: this.props.destinationSearchString,
      parcelLocationPhysicalAddress: this.props.locationSearchString,
      parcelLocation: [
        this.props.pickUpLocation.location.longitude,
        this.props.pickUpLocation.location.latitude,
      ],
      parcelDestination: [
        this.props.pickUpDestination.location.longitude,
        this.props.pickUpDestination.location.latitude,
      ],
    };

    this.props.createParcel(options);
  }

  renderCreatingparcel() {
    const visible =
      this.props.createParcelStatus === createParcel.CREATE_PARCEL_STARTED;
    return (
      <Modal visible={visible} style={styles.modal}>
        <View style={styles.modalSubContainer}>
          <SpinKit type="Circle" size={190} color={Colors.Brand.brandColor} />
          <H1 style={styles.available}>Creating transaction</H1>
        </View>
      </Modal>
    );
  }

  searchDrivers() {
    let coords: any = {};
    if (this.props.reAssigning) {
      const [longitude, latitude] = this.props.parcel.parcelLocation;
      coords = {longitude, latitude};
    } else {
      coords = this.props.pickUpLocation.location;
    }
    const {latitude, longitude} = coords;
    const center = [latitude, longitude];
    const radiusInM = this.props.variables.radiusOfMatch * 1000;
    const bounds = geoHash.geohashQueryBounds([latitude, longitude], radiusInM);
    const promises = [];
    for (const b of bounds) {
      const q = FireStore()
        .collection('drivers')
        .orderBy('geohash')
        .startAt(b[0])
        .endAt(b[1]);

      promises.push(q.get());
    }

    Promise.all(promises)
      .then((snapshots) => {
        const matchingDocs = [];

        for (const snap of snapshots) {
          for (const doc of snap.docs) {
            const lat = doc.get('lat') as number;
            const lng = doc.get('lng') as number;

            // We have to filter out a few false positives due to GeoHash
            // accuracy, but most will match
            const distanceInKm = geoHash.distanceBetween([lat, lng], center);
            const distanceInM = distanceInKm * 1000;
            if (distanceInM <= radiusInM) {
              matchingDocs.push(doc);
            }
          }
        }

        return matchingDocs;
      })
      .then((matchingDocs) => {
        if (matchingDocs.length === 0) {
          this.setState({isEmpty: true, isLoading: false});
        } else {
          let docs: any[] = [];
          matchingDocs.forEach((doc) => {
            let driver = doc.data();
            driver.id = doc.id;
            if (driver.isAvailable !== false) {
              docs.push(driver);
            }
          });
          this.setState(
            {drivers: docs, isEmpty: false, isLoading: false},
            () => {
              this.callFit();
            },
          );
        }

        // Process the matching documents
        // ...
      });
  }

  search() {
    this.setState(
      {
        isLoading: true,
        isEmpty: false,
        drivers: [],
      },
      () => {
        this.searchDrivers();
      },
    );
  }

  componentDidMount() {
    this.search();
  }

  componentWillUnmount() {}

  callFit() {
    this.mapRef.fitToCoordinates([this.origin, this.destination], {
      edgePadding: {
        bottom: 200,
        right: 50,
        top: 150,
        left: 50,
      },
      animated: true,
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
      crashlytics().log('Getting formatted cordinates error');
      crashlytics().recordError(e);
      return {
        latitude: 0.28,
        longitude: 0.2992,
      };
    }
  }

  render() {
    let checkDst: any = {};
    let checkInit: any = {};
    if (this.props.reAssigning) {
      const [longitude, latitude] = this.props.parcel.parcelLocation;
      checkInit = {location: {longitude, latitude}};
    } else {
      checkInit = this.props.pickUpLocation;
    }

    if (this.props.reAssigning) {
      const [longitude, latitude] = this.props.parcel.parcelDestination;
      checkDst = {location: {longitude, latitude}};
    } else {
      checkDst = this.props.pickUpDestination;
    }
    const origin = this.getCoords(checkInit);
    this.origin = origin;
    const destination = this.getCoords(checkDst);
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
              onReady={() => {
                this.callFit();
              }}
              origin={origin}
              destination={destination}
              apikey={API_KEY}
              strokeWidth={3}
              strokeColor={Colors.Brand.brandColor}
            />

            <Marker
              title={this.props.pickUpLocation.address}
              coordinate={origin}
              pinColor={Colors.Brand.brandColor}
              key={this.props.pickUpLocation.name}
              identifier={this.props.pickUpLocation.name}
            />
          </MapView>
          <View style={styles.suggestion}>
            {this.state.isLoading && (
              <View style={styles.searchingDriverContainer}>
                <SpinKit
                  color={Colors.Brand.brandColor}
                  size={60}
                  type="Circle"
                />
                <Text note style={styles.searchingDriverText}>
                  Searching driver ...{' '}
                </Text>
              </View>
            )}

            {
              <FlatList
                data={this.state.drivers}
                ListEmptyComponent={() =>
                  this.state.isEmpty ? (
                    <View style={styles.listEmptyComponent}>
                      <Icon
                        style={styles.emptyComponentIcon}
                        type="MaterialIcons"
                        name="drive-eta"
                      />
                      <H1 style={styles.emptyComponentText}>
                        No Drivers Available
                      </H1>
                      <Text style={styles.noDriverText}>
                        Dansako could not find a nearby driver
                      </Text>
                      <Button
                        onPress={() => this.search()}
                        rounded
                        style={styles.btnRetrySearchDriver}>
                        <Text uppercase={false} style={styles.retryText}>
                          Retry
                        </Text>
                      </Button>
                    </View>
                  ) : (
                    <Text />
                  )
                }
                renderItem={({item}: any) => (
                  <ListItem onPress={() => this.requestParcelDelivery(item.id)}>
                    <Avatar source={{uri: item.photo}} />
                    <Body>
                      <H3 style={styles.driverItemName}>
                        {`${item.firstName + ' ' + item.lastName}`}
                      </H3>
                      <Text note>Driver</Text>
                    </Body>
                    <Icon
                      style={{color: Colors.Brand.brandColor}}
                      name="select1"
                      type="AntDesign"
                    />
                  </ListItem>
                )}
              />
            }
          </View>

          <Fab
            active={true}
            style={styles.backFab}
            position="topLeft"
            onPress={() => Navigation.pop(this.props.componentId)}>
            <Icon style={{color: Colors.Brand.brandColor}} name="arrow-back" />
          </Fab>
        </View>
        {this.renderCreatingparcel()}
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchStateToProps)(SearchPickUp);
