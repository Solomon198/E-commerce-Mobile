import {Keyboard} from 'react-native';
import {put, takeEvery, call} from 'redux-saga/effects';
import axios from 'axios';
import {appUrl} from '../../configs/globals.config';
import UserType from '../types/user';
import {User} from '../../../nav.config/nav.stack';
import {
  inputActionType,
  loginActionType,
  RessetPasswordActionType,
  signUpActionType,
  verificationActionType,
  verifyingCodeAction,
} from '../../configs/global.enum';
import Utils from '../utilities/index';
import * as joi from 'react-native-joi';
import {Navigation} from 'react-native-navigation';
import crashlytics from '@react-native-firebase/crashlytics';

const loggedInlogs = async (payload: UserType) => {
  return Promise.all([
    crashlytics().setUserId(payload.userId),
    crashlytics().setAttribute('phoneNumber', payload.phoneNumber),
    crashlytics().setAttributes({
      firstName: payload.firtName,
      lastName: payload.lastName,
      gender: payload.gender,
    }),
  ]);
};
const loginSchema = joi.object({
  phoneNumber: joi.string().length(11).required(),
  password: joi.string().min(8).required(),
  countryCode: joi.string().length(2).required(),
});
const login = async (payload: any) => {
  return await axios.post(appUrl + '/login', payload);
};
//LOGIN
// ********************************** **************************************************
function* WatchLogin() {
  yield takeEvery(loginActionType.LOGIN_CALLER, function* (action: any) {
    try {
      yield put({type: loginActionType.LOGIN_STARTED});
      crashlytics().log('logging started');
      const {error} = loginSchema.validate(action.payload);

      if (error) {
        yield put({
          type: loginActionType.LOGIN_FAILED,
          payload: error.details[0].message,
        });
        crashlytics().log('login validation error aborted login');
      } else {
        const logUserIn = yield call(login.bind(this, action.payload));

        const {accessToken, refreshToken, payload} = logUserIn.data;

        yield put({
          type: loginActionType.LOGIN_SUCCESS,
          payload: payload,
          accessToken: accessToken,
          refreshToken: refreshToken,
        });

        crashlytics().log('login success');
        yield call(loggedInlogs.bind(null, payload));
        User();
      }
    } catch (e) {
      let errorMessage: string;
      let requestStatus: number;

      if (e.response) {
        const {status, data} = e.response;

        errorMessage = data.message || e.message;

        requestStatus = status as number;
      } else {
        errorMessage = e.message;
        requestStatus = 0;
      }
      if (Utils.Helpers.matchStatus(requestStatus)) {
        yield put({type: loginActionType.LOGIN_FAILED, payload: errorMessage});
      } else {
        yield put({type: loginActionType.LOGIN_FAILED, payload: errorMessage});
      }

      crashlytics().log('login error');
      crashlytics().recordError(e);
    }
  });
}

function* watchLogout() {
  yield takeEvery('DO-LOGOUT', function* () {
    try {
      yield put({type: 'LOGOUT'});
    } catch (e) {}
  });
}

function* WatchSetLoginPhoneNumber() {
  yield takeEvery('DO-SET-LOGIN-PHONE-NUMBER', function* (action: any) {
    yield put({type: 'SET-LOGIN-PHONE-NUMBER', payload: action.payload});
  });
}

function* watchSetLoginPassword() {
  yield takeEvery('DO-SET-LOGIN-PASSWORD', function* (action: any) {
    yield put({type: 'SET-LOGIN-PASSWORD', payload: action.payload});
  });
}

// ************************************************ SIGN UP

const signUpSchema = joi.object({
  phoneNumber: joi.string().length(11).required(),
  firstName: joi.string().min(2).required(),
  lastName: joi.string().min(2).required(),
  gender: joi.string().min(2).required(),
  password: joi.string().min(8).required(),
  countryCode: joi.string().length(2).required(),
});
const signUp = async (payload: any) => {
  return await axios.post(appUrl + '/signUp', payload);
};

const verifyPhoneNumber = async (payload: any) => {
  return await axios.post(appUrl + '/verify/sms', payload);
};

function* watchSignUp() {
  yield takeEvery(signUpActionType.SIGNUP_CALLER, function* (action: any) {
    try {
      yield put({type: signUpActionType.SIGNUP_STARTED});
      crashlytics().log(' signup started');
      const {error} = signUpSchema.validate(action.payload);

      if (error) {
        yield put({
          type: signUpActionType.SIGNUP_FAILED,
          payload: error.details[0].message,
        });
        crashlytics().log('input validation error');
      } else {
        const signUserIn = yield call(signUp.bind(this, action.payload));

        const {payload} = signUserIn.data;

        let validationPayload = {
          phoneNumber: action.payload.phoneNumber,
          countryCode: action.payload.countryCode,
        };

        const sendVerificationCode = yield call(
          verifyPhoneNumber.bind(this, validationPayload),
        );

        let token = sendVerificationCode.data.payload.token;

        yield put({
          type: signUpActionType.SIGNUP_SUCCESS,
          payload: payload,
          token: token,
        });

        crashlytics().log('logged in successfully');
        yield call(loggedInlogs.bind(null, payload));
        Navigation.push('stack.auth.signup', {
          component: {
            name: 'stack.auth.verification',
            id: 'stack.auth.verification',
          },
        });
      }
    } catch (e) {
      let errorMessage: string;
      let requestStatus: number;

      if (e.response) {
        const {status, data} = e.response;

        errorMessage = data.message || e.message;

        requestStatus = status as number;
      } else {
        errorMessage = e.message;
        requestStatus = 0;
      }

      if (Utils.Helpers.matchStatus(requestStatus)) {
        yield put({
          type: signUpActionType.SIGNUP_FAILED,
          payload: errorMessage,
        });
      } else {
        yield put({
          type: signUpActionType.SIGNUP_FAILED,
          payload: errorMessage,
        });
      }

      crashlytics().log('error signing up');
      crashlytics().recordError(e);
    }
  });
}

function* watchSetSignUpFirstName() {
  yield takeEvery('DO-SET-FIRST-NAME', function* (action: any) {
    yield put({type: 'SET-FIRST-NAME', payload: action.payload});
  });
}

function* watchSetSignUpLastName() {
  yield takeEvery('DO-SET-LAST-NAME', function* (action: any) {
    yield put({type: 'SET-LAST-NAME', payload: action.payload});
  });
}
function* watchSetSignUpPhoneNumber() {
  yield takeEvery('DO-SET-SIGNUP-PHONE-NUMBER', function* (action: any) {
    yield put({type: 'SET-SIGNUP-PHONE-NUMBER', payload: action.payload});
  });
}

function* watchSetSignUpPassword() {
  yield takeEvery('DO-SET-SIGNUP-PASSWORD', function* (action: any) {
    yield put({type: 'SET-SIGNUP-PASSWORD', payload: action.payload});
  });
}

function* watchSetGender() {
  yield takeEvery('DO-SET-GENDER', function* (action: any) {
    yield put({type: 'SET-GENDER', payload: action.payload});
  });
}

//****************************RESET PASSWORD************************************ */

function* watchSetRessetPasswordPhoneNumber() {
  yield takeEvery(
    'DO-SET-RESSET-PASSWORD-PHONE-NUMBER',
    function* (action: any) {
      yield put({
        type: 'SET-RESSET-PASSWORD-PHONE-NUMBER',
        payload: action.payload,
      });
    },
  );
}

function* watchConfirmPhoneNumber() {
  yield takeEvery('DO-CONFIRM-PHONE_NUMBER', function* () {
    ///
  });
}

// VERIFICATION ACTIONS

function* watchSetVerificationPin() {
  yield takeEvery('DO-SET-VERIFICATION-PIN', function* (action: any) {
    yield put({type: 'SET-VERIFICATION-PIN', payload: action.payload});
  });
}

function* watchSetTimerElapse() {
  yield takeEvery('DO-SET-TIMER-ELAPSE', function* (action: any) {
    yield put({type: 'SET-TIMER-ELAPSE', payload: action.payload});
  });
}

const validateInput = joi.object({
  phoneNumber: joi.string().required().length(11),
  countryCode: joi.string().length(2),
});

function* watchResendCodeAuth() {
  yield takeEvery(
    verificationActionType.SEND_VERIFICATION_CODE_CALLER,
    function* (action: any) {
      crashlytics().log('send verification code started');
      try {
        yield put({
          type: verificationActionType.SEND_VERIFICATION_CODE_STARTED,
        });

        const {error} = validateInput.validate(action.payload);
        if (!error) {
          const sendVerificationCode = yield call(
            verifyPhoneNumber.bind(this, action.payload),
          );
          let token = sendVerificationCode.data.payload.token;

          yield put({type: inputActionType.CHANGE_COUNTDOWN_COMPONENT_ID});
          yield put({
            type: verificationActionType.SEND_VERIFICATION_CODE_SUCCESS,
            payload: token,
          });

          crashlytics().log('verification code sent successfully');
          if (action.resetPasswordFlow) {
            Navigation.push('stack.auth.validate.reset.credentials', {
              component: {
                name: 'stack.auth.verification',
                id: 'stack.auth.verification',
                passProps: {
                  resetPasswordFlow: true,
                  ressetPhoneNumber: action.payload.phoneNumber,
                },
              },
            });
          }
        } else {
          crashlytics().log('input validation error');
          yield put({
            type: verificationActionType.SEND_VERIFICATION_CODE_FAILED,
            payload: error.details[0].message,
          });
        }
      } catch (e) {
        let errorMessage: string;
        let requestStatus: number;

        if (e.response) {
          const {status, data} = e.response;

          errorMessage = data.message || e.message;

          requestStatus = status as number;
        } else {
          errorMessage = e.message;
          requestStatus = 0;
        }

        if (Utils.Helpers.matchStatus(requestStatus)) {
          yield put({
            type: verificationActionType.SEND_VERIFICATION_CODE_FAILED,
            payload: errorMessage,
          });
        } else {
          yield put({
            type: verificationActionType.SEND_VERIFICATION_CODE_FAILED,
            payload: errorMessage,
          });
        }

        crashlytics().log('error sending verification code');
        crashlytics().recordError(e);
      }
    },
  );
}

// resset passwor d
function* watchSetNewpassword() {
  yield takeEvery('DO-SET-NEW-PASSWORD', function* (action: any) {
    yield put({type: 'SET-NEW-PASSWORD', payload: action.payload});
  });
}

function* watchSetConfirmNewpassword() {
  yield takeEvery('DO-SET-CONFIRM-NEW-PASSWORD', function* (action: any) {
    yield put({type: 'SET-CONFIRM-NEW-PASSWORD', payload: action.payload});
  });
}

const verifyPin = async (payload: any) => {
  return await axios.post(appUrl + '/verify/code', payload);
};
const valdiateVerifyingCodeInput = joi.object({
  pin: joi.string().required().length(4),
  token: joi.string(),
});

function* watchVerifyCodeSent() {
  yield takeEvery(
    verifyingCodeAction.VERIFYING_CODE_CALLER,
    function* (action: any) {
      crashlytics().log('verifiying code sent started');
      try {
        yield put({type: verifyingCodeAction.VERIFYING_CODE_STARTED});

        const {error} = valdiateVerifyingCodeInput.validate(action.payload);
        if (!error) {
          const verifyCodeSent = yield call(
            verifyPin.bind(this, action.payload),
          );

          let {payload} = verifyCodeSent.data;

          yield put({
            type: verifyingCodeAction.VERIFYING_CODE_SUCCESS,
            payload: payload,
          });

          crashlytics().log('pin verification success');
          if (!action.resetPasswordFlow) {
            User();
          } else {
            Navigation.push('stack.auth.verification', {
              component: {
                name: 'stack.auth.newPassword',
                id: 'stack.auth.newPassword',
              },
            });
          }
        } else {
          yield put({
            type: verifyingCodeAction.VERIFYING_CODE_FAILED,
            payload: error.details[0].message,
          });
          crashlytics().log('input validation error');
        }
      } catch (e) {
        let errorMessage: string;
        let requestStatus: number;

        if (e.response) {
          const {status, data} = e.response;

          errorMessage = data.message || e.message;

          requestStatus = status as number;
        } else {
          errorMessage = e.message;
          requestStatus = 0;
        }

        if (Utils.Helpers.matchStatus(requestStatus)) {
          yield put({
            type: verifyingCodeAction.VERIFYING_CODE_FAILED,
            payload: errorMessage,
          });
        } else {
          yield put({
            type: verifyingCodeAction.VERIFYING_CODE_FAILED,
            payload: errorMessage,
          });
        }

        crashlytics().log('verifying pin failed');
        crashlytics().recordError(e);
      }
    },
  );
}

const ressetPasswordRequest = async (payload: any) => {
  return await axios.post(appUrl + '/reset-password', payload);
};
const ressetPasswordValidation = joi.object({
  password: joi.string().required(),
  accessToken: joi.string().required(),
});
function* ressetPassword() {
  yield takeEvery(
    RessetPasswordActionType.RESSET_PASSWORD_CALLER,
    function* (action: any) {
      try {
        crashlytics().log('resseting password started');
        yield put({type: RessetPasswordActionType.RESSET_PASSWORD_STARTED});

        if (action.payload.password !== action.confirmNewPassword) {
          yield put({
            type: RessetPasswordActionType.RESSET_PASSWORD_FAILED,
            payload: 'password do not match',
          });
          crashlytics().log('password mismatch aborted request');
        } else {
          const {error} = ressetPasswordValidation.validate(action.payload);
          if (!error) {
            const verifyCodeSent = yield call(
              ressetPasswordRequest.bind(this, action.payload),
            );

            let {payload} = verifyCodeSent.data;

            yield put({
              type: RessetPasswordActionType.RESSET_PASSWORD_SUCCESS,
              payload: payload,
            });
            Keyboard.dismiss();
            crashlytics().log('password resseted successfully');
            User();
          } else {
            yield put({
              type: RessetPasswordActionType.RESSET_PASSWORD_FAILED,
              payload: error.details[0].message,
            });
            crashlytics().log('validation error, invalid input');
          }
        }
      } catch (e) {
        let errorMessage: string;
        let requestStatus: number;

        if (e.response) {
          const {status, data} = e.response;

          errorMessage = data.message || e.message;

          requestStatus = status as number;
        } else {
          errorMessage = e.message;
          requestStatus = 0;
        }

        if (Utils.Helpers.matchStatus(requestStatus)) {
          yield put({
            type: RessetPasswordActionType.RESSET_PASSWORD_FAILED,
            payload: errorMessage,
          });
        } else {
          yield put({
            type: RessetPasswordActionType.RESSET_PASSWORD_FAILED,
            payload: errorMessage,
          });
        }

        crashlytics().log('error resseting password');
        crashlytics().recordError(e);
      }
    },
  );
}

export default {
  ressetPassword,
  watchSetConfirmNewpassword,
  watchSetNewpassword,
  watchVerifyCodeSent,

  watchSetRessetPasswordPhoneNumber,
  watchConfirmPhoneNumber,
  watchSetVerificationPin,
  watchSetTimerElapse,
  watchResendCodeAuth,

  watchSetSignUpFirstName,
  watchSetSignUpLastName,
  watchSetSignUpPhoneNumber,
  watchSetSignUpPassword,
  watchSetGender,
  watchSignUp,

  WatchLogin,
  watchLogout,
  watchSetLoginPassword,
  WatchSetLoginPhoneNumber,
};
