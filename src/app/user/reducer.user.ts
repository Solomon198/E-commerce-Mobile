import {
  createParcel,
  currentLocation,
  inputActionType,
  searchLocation,
  setLocation,
  cancelDeliveryActionType,
  confirmDeliveryActionType,
  AddCreditCard,
  RemoveCreditCard,
  GetCreditCards,
  GetUsersParcel,
} from '../../configs/global.enum';

const initialState = {
  locationSearchString: '',
  destinationSearchString: '',
  locationInputActive: true,

  cardEmail: '',

  searchingLocation: searchLocation.SEARCH_LOCATION_DEFAULT,
  searchingDestination: searchLocation.SEARCH_LOCATION_DEFAULT,
  searchResults: [],

  pickUpLocation: {},
  pickUpDestination: {},
  deliveryDeleted: false,

  currentLocation: [],
  currentLocationStatus: currentLocation.GET_CUURENT_LOCATION_DEFAULT,

  directionInfo: {},

  userCards: null,
  paymentMethod: 'cash',
  addCardEnabled: false,
  selectedCard: {},

  paymentOptionsRenderer: 0,

  variables: {},
  createParcelStatus: createParcel.CREATE_PARCEL_DEFAULT,
  cancelDeliveryStatus: cancelDeliveryActionType.CANCEL_DELIVERY_DEFAULT,
  confirmDeliveryStatus: confirmDeliveryActionType.CONFIRM_DELIVERY_DEFAULT,

  activeDelivery: null,
  driver: null,
  watchPosition: {longitude: 0, latitude: 0},
  addCreditCardStatus: AddCreditCard.ADD_CREDIT_CARD_DEFAULT,
  removeCreditCardStatus: RemoveCreditCard.REMOVE_CREDIT_CARD_DEFAULT,
  getCreditCardStatus: GetCreditCards.GET_CREDIT_CARD_DEFAULT,
  addCreditCardError: '',
  removeCreditCardError: '',
  getCreditCardError: '',

  page: 1,
  gettingParcelStatus: GetUsersParcel.GET_PARCEL_DEFAULT,
  errorGettingParcel: '',
  parcels: [],
};

function UserReducer(state = initialState, action: any) {
  switch (action.type) {
    case GetUsersParcel.GET_PARCEL_STARTED: {
      state = {
        ...state,
        gettingParcelStatus: GetUsersParcel.GET_PARCEL_STARTED,
        errorGettingParcel: '',
      };
      return state;
    }

    case GetUsersParcel.GET_PARCEL_FAILED: {
      state = {
        ...state,
        gettingParcelStatus: GetUsersParcel.GET_PARCEL_FAILED,
        errorGettingParcel: action.payload,
      };
      return state;
    }

    case GetUsersParcel.GET_PARCEL_SUCCESS: {
      state = {
        ...state,
        gettingParcelStatus: GetUsersParcel.GET_PARCEL_SUCCESS,
        errorGettingParcel: '',
        parcels:
          action.page !== 1
            ? [...state.parcels, ...action.payload]
            : action.payload,
        page: action.payload.length === 0 ? action.page : action.page + 1,
      };
      return state;
    }

    case GetCreditCards.GET_CREDEIT_CARD_STARTED: {
      state = {
        ...state,
        getCreditCardStatus: GetCreditCards.GET_CREDEIT_CARD_STARTED,
      };
      return state;
    }

    case GetCreditCards.GET_CREDIT_CARD_FAILED: {
      state = {
        ...state,
        getCreditCardStatus: GetCreditCards.GET_CREDIT_CARD_FAILED,
        getCreditCardError: action.payload,
      };
      return state;
    }

    case GetCreditCards.GET_CREDIT_CARD_SUCCESS: {
      state = {
        ...state,
        getCreditCardStatus: GetCreditCards.GET_CREDIT_CARD_SUCCESS,
        userCards: action.payload,
      };
      return state;
    }

    case RemoveCreditCard.REMOVE_CREDEIT_CARD_STARTED: {
      state = {
        ...state,
        removeCreditCardStatus: RemoveCreditCard.REMOVE_CREDEIT_CARD_STARTED,
      };
      return state;
    }

    case RemoveCreditCard.REMOVE_CREDIT_CARD_FAILED: {
      state = {
        ...state,
        removeCreditCardStatus: RemoveCreditCard.REMOVE_CREDIT_CARD_FAILED,
        removeCreditCardError: action.payload,
      };
      return state;
    }

    case RemoveCreditCard.REMOVE_CREDIT_CARD_SUCCESS: {
      state = {
        ...state,
        userCards: null as any,
        removeCreditCardStatus: RemoveCreditCard.REMOVE_CREDIT_CARD_SUCCESS,
      };
      return state;
    }

    case AddCreditCard.ADD_CREDEIT_CARD_STARTED: {
      state = {
        ...state,
        addCreditCardError: '',
        addCreditCardStatus: AddCreditCard.ADD_CREDEIT_CARD_STARTED,
      };
      return state;
    }

    case AddCreditCard.ADD_CREDIT_CARD_FAILED: {
      state = {
        ...state,
        addCreditCardStatus: AddCreditCard.ADD_CREDIT_CARD_FAILED,
        addCreditCardError: action.payload,
      };
      return state;
    }

    case AddCreditCard.ADD_CREDIT_CARD_SUCCESS: {
      state = {
        ...state,
        userCards: action.payload as any,
        addCreditCardStatus: AddCreditCard.ADD_CREDIT_CARD_SUCCESS,
      };
      return state;
    }

    case inputActionType.SET_CARD_EMAIL: {
      state = {...state, cardEmail: action.payload};
      return state;
    }

    case inputActionType.SET_USER_CURRENT_LOCATION: {
      state = {...state, watchPosition: action.payload};
      return state;
    }
    case cancelDeliveryActionType.CANCEL_DELIVERY_STARTED: {
      state = {
        ...state,
        cancelDeliveryStatus: cancelDeliveryActionType.CANCEL_DELIVERY_STARTED,
      };
      return state;
    }

    case cancelDeliveryActionType.CANCEL_DELIVERY_FAILED: {
      state = {
        ...state,
        cancelDeliveryStatus: cancelDeliveryActionType.CANCEL_DELIVERY_FAILED,
      };
      return state;
    }

    case cancelDeliveryActionType.CANCEL_DELIVERY_SUCCESS: {
      state = {
        ...state,
        cancelDeliveryStatus: cancelDeliveryActionType.CANCEL_DELIVERY_SUCCESS,
      };
      return state;
    }

    case confirmDeliveryActionType.CONFIRM_DELIVERY_STARTED: {
      state = {
        ...state,
        confirmDeliveryStatus:
          confirmDeliveryActionType.CONFIRM_DELIVERY_STARTED,
      };
      return state;
    }

    case confirmDeliveryActionType.CONFIRM_DELIVERY_FAILED: {
      state = {
        ...state,
        confirmDeliveryStatus:
          confirmDeliveryActionType.CONFIRM_DELIVERY_FAILED,
      };
      return state;
    }

    case confirmDeliveryActionType.CONFIRM_DELIVERY_SUCCESS: {
      state = {
        ...state,
        confirmDeliveryStatus:
          confirmDeliveryActionType.CONFIRM_DELIVERY_SUCCESS,
      };
      return state;
    }

    case inputActionType.SET_TRACK_ACTIVE_DELIVERY: {
      if (action.payload) {
        state = {
          ...state,
          activeDelivery: action.payload,
          driver: action.driver,
          deliveryDeleted: false,
        };
      } else {
        if (state.activeDelivery && !action.discard) {
          state = {
            ...state,
            deliveryDeleted: true,
            driver: null,
          };
        } else {
          state = {
            ...state,
            activeDelivery: action.payload,
            driver: null,
            deliveryDeleted: false,
          };
        }
      }
      return state;
    }
    case createParcel.CREATE_PARCEL_STARTED: {
      state = {
        ...state,
        createParcelStatus: createParcel.CREATE_PARCEL_STARTED,
      };
      return state;
    }

    case createParcel.CREATE_PARCEL_FAILED: {
      state = {
        ...state,
        createParcelStatus: createParcel.CREATE_PARCEL_FAILED,
      };
      return state;
    }

    case createParcel.CREATE_PARCEL_SUCCESS: {
      state = {
        ...state,
        createParcelStatus: createParcel.CREATE_PARCEL_SUCCESS,
      };
      return state;
    }

    case inputActionType.SET_VARIABLES: {
      state = {...state, variables: action.payload};
      return state;
    }

    case inputActionType.SET_CHANGE_PAYMENT_METHOD: {
      state = {
        ...state,
        paymentMethod: action.payload as string,
        selectedCard: action.card,
      };
      return state;
    }

    case inputActionType.SET_ENABLE_ADD_BUTTON: {
      state = {...state, addCardEnabled: action.payload};
      return state;
    }

    case inputActionType.SET_DURATION_AND_DISTANCE_CALLER: {
      state = {...state, directionInfo: action.payload};
      return state;
    }

    case currentLocation.GET_CUURENT_LOCATION_STARTED: {
      state = {
        ...state,
        currentLocationStatus: currentLocation.GET_CUURENT_LOCATION_STARTED,
      };
      return state;
    }

    case currentLocation.GET_CUURENT_LOCATION_FAILED: {
      state = {
        ...state,
        currentLocationStatus: currentLocation.GET_CUURENT_LOCATION_FAILED,
      };
      return state;
    }

    case currentLocation.GET_CUURENT_LOCATION_SUCCESS: {
      console.log(action.payload);
      state = {
        ...state,
        currentLocationStatus: currentLocation.GET_CUURENT_LOCATION_SUCCESS,
        currentLocation: action.payload,
      };
      return state;
    }

    case inputActionType.SET_RESET_INPUTS: {
      state = {
        ...state,

        locationSearchString: '',
        destinationSearchString: '',
        locationInputActive: true,

        searchingLocation: searchLocation.SEARCH_LOCATION_DEFAULT,
        searchingDestination: searchLocation.SEARCH_LOCATION_DEFAULT,
        searchResults: [],

        pickUpLocation: {},
        pickUpDestination: {},

        directionInfo: {},
      };

      return state;
    }

    case setLocation.SET_LOCATION_SUCCESS: {
      if (state.locationInputActive) {
        state = {
          ...state,
          pickUpLocation: action.payload,
          searchingLocation: searchLocation.SEARCH_LOCATION_SUCCESS,
          locationSearchString: action.payload.address,
        };
      } else {
        state = {
          ...state,
          pickUpDestination: action.payload,
          searchingDestination: searchLocation.SEARCH_LOCATION_SUCCESS,
          destinationSearchString: action.payload.address,
        };
      }

      return state;
    }

    case searchLocation.SEARCH_LOCATION_STARTED: {
      if (state.locationInputActive) {
        state = {
          ...state,
          searchingLocation: searchLocation.SEARCH_LOCATION_STARTED,
        };
      } else {
        state = {
          ...state,
          searchingDestination: searchLocation.SEARCH_LOCATION_STARTED,
        };
      }
      return state;
    }

    case searchLocation.SEARCH_LOCATION_SUCCESS: {
      if (state.locationInputActive) {
        state = {
          ...state,
          searchingLocation: searchLocation.SEARCH_LOCATION_SUCCESS,
          searchResults: action.payload,
        };
      } else {
        state = {
          ...state,
          searchingDestination: searchLocation.SEARCH_LOCATION_SUCCESS,
          searchResults: action.payload,
        };
      }
      return state;
    }
    case searchLocation.SEARCH_LOCATION_FAILED: {
      if (state.locationInputActive) {
        state = {
          ...state,
          searchingLocation: searchLocation.SEARCH_LOCATION_FAILED,
        };
      } else {
        state = {
          ...state,
          searchingDestination: searchLocation.SEARCH_LOCATION_FAILED,
        };
      }
      return state;
    }

    case inputActionType.SET_PARCEL_LOCATION: {
      state = {...state, locationSearchString: action.payload};
      return state;
    }

    case inputActionType.SET_PARCEL_DESITINATION: {
      state = {...state, destinationSearchString: action.payload};
      return state;
    }

    case inputActionType.SET_LOCATION_ACTIVE: {
      state = {...state, locationInputActive: action.payload};
      return state;
    }
  }

  return state;
}

export default UserReducer;
