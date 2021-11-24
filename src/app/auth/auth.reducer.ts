import {
  loginActionType,
  signUpActionType,
  inputActionType,
  authAction,
  verificationActionType,
  verifyingCodeAction,
  RessetPasswordActionType,
} from '../../configs/global.enum';

const initialState = {
  user: {},
  accessToken: '',
  refreshToken: '',

  loginPhoneNumber: '',
  loginPassword: '',

  firstName: '',
  lastName: '',
  gender: '',
  password: '',
  phoneNumber: '',

  login: loginActionType.LOGIN_DEFAULT,
  signUp: signUpActionType.SIGNUP_DEFAULT,
  verification: verificationActionType.SEND_VERIFICATION_CODE_DEFAULT,
  verifyingPin: verifyingCodeAction.VERIFYING_CODE_DEFAULT,

  verificationToken: '',

  errorLogin: '',
  errorSignUp: '',
  verificationError: '',

  verificationPin: '',
  timerElapse: false,
  countdownComponentId: 'default',

  resetPhoneNumber: '',

  newPassword: '',
  confirmNewPassword: '',

  ressetPassword: RessetPasswordActionType.RESSET_PASSWORD_DEFAULT,

  ressetPasswordError: '',
};

function AuthReducer(state = initialState, action: any) {
  switch (action.type) {
    case inputActionType.SET_PROFILE_PICTURE: {
      let user = state.user as any;
      user = {...user, photo: action.payload};
      state = {...state, user: user};
      return state;
    }
    case RessetPasswordActionType.RESSET_PASSWORD_STARTED: {
      state = {
        ...state,
        ressetPassword: RessetPasswordActionType.RESSET_PASSWORD_STARTED,
      };
      return state;
    }

    case RessetPasswordActionType.RESSET_PASSWORD_FAILED: {
      state = {
        ...state,
        ressetPassword: RessetPasswordActionType.RESSET_PASSWORD_FAILED,
        ressetPasswordError: action.payload,
      };
      return state;
    }

    case RessetPasswordActionType.RESSET_PASSWORD_SUCCESS: {
      state = {
        ...state,
        ressetPassword: RessetPasswordActionType.RESSET_PASSWORD_SUCCESS,
        ressetPasswordError: '',
      };
      return state;
    }

    case verificationActionType.SEND_VERIFICATION_CODE_STARTED: {
      state = {
        ...state,
        verification: verificationActionType.SEND_VERIFICATION_CODE_STARTED,
        verificationError: '',
      };
      return state;
    }

    case verificationActionType.SEND_VERIFICATION_CODE_FAILED: {
      state = {
        ...state,
        verification: verificationActionType.SEND_VERIFICATION_CODE_FAILED,
        verificationError: action.payload,
      };
      return state;
    }

    case verificationActionType.SEND_VERIFICATION_CODE_SUCCESS: {
      state = {
        ...state,
        verification: verificationActionType.SEND_VERIFICATION_CODE_SUCCESS,
        verificationError: '',
        verificationToken: action.payload,
      };
      return state;
    }

    case verifyingCodeAction.VERIFYING_CODE_STARTED: {
      state = {
        ...state,
        verifyingPin: verifyingCodeAction.VERIFYING_CODE_STARTED,
        verificationError: '',
      };
      return state;
    }

    case verifyingCodeAction.VERIFYING_CODE_FAILED: {
      state = {
        ...state,
        verifyingPin: verifyingCodeAction.VERIFYING_CODE_FAILED,
        verificationError: action.payload,
      };
      return state;
    }

    case verifyingCodeAction.VERIFYING_CODE_SUCCESS: {
      state = {
        ...state,
        verifyingPin: verifyingCodeAction.VERIFYING_CODE_SUCCESS,
        verificationError: '',
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        user: action.payload.user,
      };
      return state;
    }

    case inputActionType.SET_LOGIN_PHONE_NUMBER: {
      state = {...state, loginPhoneNumber: action.payload};
      return state;
    }

    case inputActionType.SET_LOGIN_PASSWORD: {
      state = {...state, loginPassword: action.payload};
      return state;
    }

    case inputActionType.SET_FIRST_NAME: {
      state = {...state, firstName: action.payload};
      return state;
    }

    case inputActionType.SET_LAST_NAME: {
      state = {...state, lastName: action.payload};
      return state;
    }

    case inputActionType.SET_SIGNUP_PHONE_NUMBER: {
      state = {...state, phoneNumber: action.payload};
      return state;
    }

    case inputActionType.SET_SIGNUP_PASSWORD: {
      state = {...state, password: action.payload};
      return state;
    }

    case inputActionType.SET_GENDER: {
      state = {...state, gender: action.payload};
      return state;
    }

    case loginActionType.LOGIN_STARTED: {
      state = {...state, login: loginActionType.LOGIN_STARTED, errorLogin: ''};
      return state;
    }

    case loginActionType.LOGIN_FAILED: {
      state = {
        ...state,
        login: loginActionType.LOGIN_FAILED,
        errorLogin: action.payload,
      };
      return state;
    }

    case loginActionType.LOGIN_SUCCESS: {
      state = {
        ...state,
        login: loginActionType.LOGIN_SUCCESS,
        user: action.payload,
        accessToken: action.accessToken,
        refreshToken: action.refreshToken,
        verification: verificationActionType.SEND_VERIFICATION_CODE_SUCCESS,
      };
      return state;
    }

    case signUpActionType.SIGNUP_STARTED: {
      state = {
        ...state,
        signUp: signUpActionType.SIGNUP_STARTED,
        errorSignUp: '',
      };
      return state;
    }

    case signUpActionType.SIGNUP_FAILED: {
      state = {
        ...state,
        signUp: signUpActionType.SIGNUP_FAILED,
        errorSignUp: action.payload,
      };
      return state;
    }

    case signUpActionType.SIGNUP_SUCCESS: {
      state = {
        ...state,
        signUp: signUpActionType.SIGNUP_SUCCESS,
        user: action.payload,
        verificationToken: action.token,
      };
      return state;
    }

    case inputActionType.SET_RESSET_PASSWORD_PHONE_NUMBER: {
      state = {...state, resetPhoneNumber: action.payload};
      return state;
    }

    case inputActionType.SET_VERIFICATION_PIN: {
      state = {...state, verificationPin: action.payload};
      return state;
    }

    case inputActionType.SET_TIMER_ELAPSE: {
      state = {...state, timerElapse: true};
      return state;
    }

    case inputActionType.CHANGE_COUNTDOWN_COMPONENT_ID: {
      const newId = Math.floor(Math.random() * 1000);
      state = {
        ...state,
        countdownComponentId: newId.toString(),
        timerElapse: false,
      };
      return state;
    }

    case inputActionType.SET_NEW_PASSWORD: {
      state = {...state, newPassword: action.payload};
      return state;
    }

    case inputActionType.SET_CONFIRM_NEW_PASSWORD: {
      state = {...state, confirmNewPassword: action.payload};
      return state;
    }

    case authAction.LOGOUT: {
      state = {
        ...state,
        user: {},
        accessToken: '',
        refreshToken: '',

        loginPhoneNumber: '',
        loginPassword: '',

        firstName: '',
        lastName: '',
        gender: '',
        password: '',
        phoneNumber: '',

        login: loginActionType.LOGIN_DEFAULT,
        signUp: signUpActionType.SIGNUP_DEFAULT,
        verification: verificationActionType.SEND_VERIFICATION_CODE_DEFAULT,
        verifyingPin: verifyingCodeAction.VERIFYING_CODE_DEFAULT,

        verificationToken: '',

        errorLogin: '',
        errorSignUp: '',
        verificationError: '',

        verificationPin: '',
        timerElapse: false,
        countdownComponentId: 'default',

        resetPhoneNumber: '',

        newPassword: '',
        confirmNewPassword: '',
      };

      return state;
    }
  }

  return state;
}

export default AuthReducer;
