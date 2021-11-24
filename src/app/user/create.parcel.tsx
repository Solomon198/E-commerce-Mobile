import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Keyboard,
  FlatList,
  Image,
  Modal,
  TouchableNativeFeedback,
} from 'react-native';
import {Icon, Spinner, Container, H3, Text, Button, Fab} from 'native-base';
import Colors from '../../configs/styles/index';
import {Navigation} from 'react-native-navigation';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import {connect} from 'react-redux';
import SpinKit from 'react-native-spinkit';
import FireStore from '@react-native-firebase/firestore';
import {
  inputActionType,
  searchLocation,
  setLocation,
} from '../../configs/global.enum';
import axios from 'axios';
import NavigationScreens from '../../../nav.config/navigation.screens';
import {API_KEY} from 'react-native-dotenv';
import crashlytics from '@react-native-firebase/crashlytics';

type searchResult = {
  primaryText: string;
  placeID: string;
  secondaryText: string;
  fullText: string;
};

type locationDetails = {
  name: string;
  longitude: number;
  address: string;
  latitude: number;
};
type Props = {
  longitude: number;
  latitude: number;
  componentId: string;
  locationSearchString: string;
  destinationSearchString: string;
  locationInputActive: boolean;
  searchingLocation: string;
  searchingDestination: string;
  searchResults: searchResult[];
  pickUpLocation: locationDetails;
  pickUpDestination: locationDetails;

  setDestinationSearchString: (str: string) => void;
  setLocationSearchString: (str: string) => void;
  setLocationInputActive: (status: boolean) => void;
  searchLocation: (str: string) => void;
  setLocation: (placeId: string) => void;
  setFetchedLocation: (payload: any) => void;
  ressetInputs: () => void;
  setVariables: (payload: any) => void;
};

const mapStateToProps = (store: any) => ({
  locationSearchString: store.User.locationSearchString,
  destinationSearchString: store.User.destinationSearchString,
  locationInputActive: store.User.locationInputActive,
  searchingLocation: store.User.searchingLocation,
  searchingDestination: store.User.searchingDestination,
  searchResults: store.User.searchResults,
  pickUpLocation: store.User.pickUpLocation,
  pickUpDestination: store.User.pickUpDestination,
});

const mapDispatchStateToProps = (dispatch: any) => ({
  setLocationSearchString: (str: string) =>
    dispatch({type: inputActionType.SET_PARCEL_LOCATION_CALLER, payload: str}),
  setDestinationSearchString: (str: string) =>
    dispatch({
      type: inputActionType.SET_PARCEL_DESITINATION_CALLER,
      payload: str,
    }),
  setLocationInputActive: (status: boolean) =>
    dispatch({
      type: inputActionType.SET_LOCATION_ACTIVE_CALLER,
      payload: status,
    }),
  searchLocation: (str: string) =>
    dispatch({type: searchLocation.SEARCH_LOCATION_CALLER, payload: str}),
  setLocation: (placeId: string) =>
    dispatch({type: setLocation.SET_LOCATION_CALLER, payload: placeId}),
  ressetInputs: () => dispatch({type: inputActionType.SET_RESET_INPUTS_CALLER}),
  setVariables: (payload: any) =>
    dispatch({type: inputActionType.SET_VARIABLES_CALLER, payload}),
  setFetchedLocation: (payload: any) =>
    dispatch({type: inputActionType.SET_LOCATION_CALLER, payload: payload}),
});

const styles = StyleSheet.create({
  confirmIco: {
    fontSize: 18,
    color: 'forestgreen',
  },
  header: {},
  ico: {
    fontSize: 20,
    color: '#888',
  },
  input: {
    backgroundColor: '#f4f4f4',
    width: '100%',
    borderRadius: 10,
  },
  label: {
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 20,
  },
  inputContainer: {
    flex: 1,
  },
  icoContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    maxHeight: 100,
    marginBottom: 10,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 15,
  },
  locationSearchedString: {
    fontSize: 14,
    fontWeight: '900',
    color: '#555',
  },
  modal: {
    flex: 1,
    backgroundColor: '#fff',
  },
  subContainer: {flexDirection: 'row'},
  closeIcon: {color: '#555'},
  mainHeader: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  hint: {
    fontSize: 12,
    color: Colors.Brand.brandColor,
    marginBottom: 10,
  },
  locationIcon: {width: 30, height: 30},
  locationSelectorContainer: {
    width: 40,
    paddingLeft: 5,
    alignContent: 'center',
    alignItems: 'center',
  },
  spinnerContainer: {width: 40},
  spinnerStyle: {height: 50},
  fabBg: {backgroundColor: '#fff'},
  map: {
    flex: 1,
  },
  headerDrag: {},
  modalHeader: {
    backgroundColor: '#fff',
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
    height: 150,
  },
  listItemExtended: {
    marginTop: 10,
  },
  defaultTextLocation: {
    marginLeft: 10,
    color: Colors.Brand.danger,
    fontSize: 13,
  },
  locationLoaderContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  locationLoaderText: {fontSize: 12},
  locationResultContainer: {flexDirection: 'row', justifyContent: 'center'},
  errorTextLocation: {
    marginLeft: 10,
    color: Colors.Brand.danger,
    fontSize: 13,
  },
  successLocationCheckIcon: {color: '#fff'},
  fabNext: {backgroundColor: '#fff'},
});
class CreateParcel extends React.Component<Props> {
  navigationEventListener: any;
  ref: any;
  vRef: any;
  pickUplocationTimerHandler: any;
  destinationTimerHandler: any;

  locationRef: any;

  state = {
    longitude: this.props.longitude,
    latitude: this.props.latitude,
    showModal: false,
    address: '',
    gettingLocationStatus: 'NOT-STARTED',
  };

  goBack() {
    Keyboard.dismiss();
    Navigation.pop(this.props.componentId);
  }

  calculateCost() {
    Keyboard.dismiss();
    if (
      this.props.pickUpDestination.address &&
      this.props.pickUpLocation.address
    ) {
      this.props.setLocationInputActive(true);
      Navigation.push(this.props.componentId, {
        component: {
          name: NavigationScreens.PARCEL_DELIVERY_CALCULATION_SCREEN,
          id: NavigationScreens.PARCEL_DELIVERY_CALCULATION_SCREEN,
        },
      });
    }
  }

  getVariables() {
    const path = FireStore().collection('Variables').doc('app');
    path
      .get()
      .then((data) => {
        let variables = data.data();
        this.props.setVariables(variables);
      })
      .catch((e) => {
        crashlytics().log('error getting environment config');
        crashlytics().recordError(e);
      });
  }

  componentDidMount() {
    this.getVariables();
    let defaultSearchStr = this.props.pickUpLocation.address || 'se';
    this.props.searchLocation(defaultSearchStr);
    this.locationRef.focus();
  }

  setPickUpLocation(text: string) {
    this.props.setLocationSearchString(text);

    if (this.pickUplocationTimerHandler) {
      clearTimeout(this.pickUplocationTimerHandler);
    }
    this.pickUplocationTimerHandler = setTimeout(() => {
      this.props.searchLocation(text);
      clearTimeout(this.pickUplocationTimerHandler);
    }, 700);
  }

  setDestinationLocation(text: string) {
    this.props.setDestinationSearchString(text);

    if (this.destinationTimerHandler) {
      clearTimeout(this.destinationTimerHandler);
    }
    this.destinationTimerHandler = setTimeout(() => {
      this.props.searchLocation(text);
      clearTimeout(this.destinationTimerHandler);
    }, 700);
  }

  componentWillUnmount() {
    this.props.setLocationInputActive(true);
    this.props.ressetInputs();
  }

  getAddress(longitude: number, latitude: number) {
    this.setState({gettingLocationStatus: 'started'});
    //function to get address using current lat and lng
    axios
      .get(
        'https://maps.googleapis.com/maps/api/geocode/json?address=' +
          latitude +
          ',' +
          longitude +
          '&key=' +
          API_KEY,
      )
      .then((responseJson) => {
        let address = responseJson.data.results[0].formatted_address;
        this.setState({
          gettingLocationStatus: 'success',
          longitude,
          latitude,
          address,
        });
      })
      .catch((e) => {
        crashlytics().log('could not get physical address from googleapis.com');
        crashlytics().recordError(e);
        this.setState({gettingLocationStatus: 'failed'});
      });
  }

  renderMap() {
    return (
      <Modal
        visible={this.state.showModal}
        onRequestClose={() => this.setState({showModal: false})}>
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          region={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}>
          <Marker
            coordinate={{
              longitude: this.state.longitude,
              latitude: this.state.latitude,
            }}
            pinColor={Colors.Brand.danger}
            draggable={true}
            onDragEnd={({
              nativeEvent: {
                coordinate: {longitude, latitude},
              },
            }) => this.getAddress(longitude, latitude)}
          />
        </MapView>
        <View style={styles.suggestion}>
          <View style={styles.enlargeIndicator} />
          <H3 style={styles.label}>
            {this.props.locationInputActive
              ? ' Pick-up location'
              : ' Destination location'}
          </H3>

          {this.state.gettingLocationStatus === 'NOT-STARTED' && (
            <View>
              <Text style={styles.defaultTextLocation}>
                You have not selected a location, drag and drop pin to select a
                location.
              </Text>
            </View>
          )}

          {this.state.gettingLocationStatus === 'started' && (
            <View style={styles.locationLoaderContainer}>
              <SpinKit
                type="Circle"
                color={Colors.Brand.brandColor}
                size={30}
              />
              <Text style={styles.locationLoaderText}>
                Getting location info...
              </Text>
            </View>
          )}
          {this.state.gettingLocationStatus === 'success' && (
            <View style={styles.locationResultContainer}>
              <View style={styles.icoContainer}>
                <Icon type="EvilIcons" style={styles.ico} name="location" />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.locationSearchedString}>
                  {this.state.address}
                </Text>
              </View>
            </View>
          )}

          {this.state.gettingLocationStatus === 'failed' && (
            <View>
              <Text style={styles.errorTextLocation}>
                Could not get location info please try again
              </Text>
            </View>
          )}

          {this.state.gettingLocationStatus === 'success' && (
            <Fab
              active={true}
              style={{backgroundColor: Colors.Brand.success}}
              position="bottomRight"
              onPress={() =>
                this.setState({showModal: false}, () => {
                  this.props.setFetchedLocation({
                    location: {
                      longitude: this.state.longitude,
                      latitude: this.state.latitude,
                    },
                    address: this.state.address,
                  });
                })
              }>
              <Icon style={styles.successLocationCheckIcon} name="checkmark" />
            </Fab>
          )}
        </View>

        <Fab
          active={true}
          style={styles.fabNext}
          position="topLeft"
          onPress={() => this.setState({showModal: false})}>
          <Icon style={{color: Colors.Brand.brandColor}} name="close" />
        </Fab>
      </Modal>
    );
  }

  render() {
    return (
      <Container style={styles.mainContainer}>
        {this.renderMap()}
        <View style={styles.subContainer}>
          <View>
            <Button onPress={() => this.goBack()} transparent small icon>
              <Icon style={styles.closeIcon} name="close" />
            </Button>
          </View>
          <View style={styles.mainHeader}>
            <H3 style={styles.label}>
              {this.props.locationInputActive
                ? 'Enter pick up location'
                : 'Enter destination'}
            </H3>
            <Text style={styles.hint}>
              click on the map icon to choose location on map
            </Text>
          </View>
        </View>
        <View style={styles.container}>
          <View style={styles.icoContainer}>
            <TouchableNativeFeedback
              onPress={() =>
                this.setState({showModal: true}, () => {
                  this.props.setLocationInputActive(true);
                })
              }>
              <Image
                style={styles.locationIcon}
                resizeMethod="resize"
                resizeMode="contain"
                source={require('../../../assets/media/images/map.png')}
              />
            </TouchableNativeFeedback>
          </View>
          <View style={[styles.inputContainer]}>
            <TextInput
              ref={(ref) => (this.locationRef = ref)}
              onFocus={() => this.props.setLocationInputActive(true)}
              style={styles.input}
              value={this.props.locationSearchString}
              placeholder="Enter pick up location"
              onChangeText={(text) => this.setPickUpLocation(text)}
            />
          </View>
          <View style={styles.locationSelectorContainer}>
            {this.props.pickUpLocation.address ? (
              <Icon
                style={styles.confirmIco}
                type="AntDesign"
                name="checkcircle"
              />
            ) : (
              <Icon
                style={[styles.confirmIco, {color: Colors.Brand.danger}]}
                type="AntDesign"
                name="closecircle"
              />
            )}
          </View>
          <View style={styles.spinnerContainer}>
            {this.props.searchingLocation === 'started' && (
              <Spinner style={styles.spinnerStyle} size={20} />
            )}
          </View>
        </View>

        <View style={styles.container}>
          <View style={styles.icoContainer}>
            <TouchableNativeFeedback
              onPress={() =>
                this.setState({showModal: true}, () => {
                  this.props.setLocationInputActive(false);
                })
              }>
              <Image
                style={styles.locationIcon}
                resizeMethod="resize"
                resizeMode="contain"
                source={require('../../../assets/media/images/map.png')}
              />
            </TouchableNativeFeedback>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              onChangeText={(text) => this.setDestinationLocation(text)}
              style={styles.input}
              value={this.props.destinationSearchString}
              placeholder="Enter destination"
              onFocus={() => this.props.setLocationInputActive(false)}
            />
          </View>
          <View style={styles.locationSelectorContainer}>
            {this.props.pickUpDestination.address ? (
              <Icon
                style={styles.confirmIco}
                type="AntDesign"
                name="checkcircle"
              />
            ) : (
              <Icon
                style={[styles.confirmIco, {color: Colors.Brand.danger}]}
                type="AntDesign"
                name="closecircle"
              />
            )}
          </View>
          <View style={styles.spinnerContainer}>
            {this.props.searchingDestination === 'started' && (
              <Spinner style={styles.spinnerStyle} size={20} />
            )}
          </View>
        </View>

        <FlatList
          data={this.props.searchResults}
          keyExtractor={(item) => item.placeID}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => {
                this.props.setLocation(item.placeID);
              }}
              style={[styles.container, styles.listItemExtended]}>
              <View style={styles.icoContainer}>
                <Icon type="EvilIcons" style={styles.ico} name="location" />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.locationSearchedString}>
                  {item.fullText}
                </Text>
                <Text note>{item.primaryText}</Text>
              </View>
            </TouchableOpacity>
          )}
        />

        {this.props.pickUpDestination.address &&
          this.props.pickUpLocation.address && (
            <Fab
              active={true}
              style={styles.fabBg}
              position="bottomRight"
              onPress={() => this.calculateCost()}>
              <Icon
                style={{color: Colors.Brand.brandColor}}
                name="arrow-forward"
              />
            </Fab>
          )}
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchStateToProps)(CreateParcel);
