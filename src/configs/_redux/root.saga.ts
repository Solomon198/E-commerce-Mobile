import {all} from 'redux-saga/effects';
import AuthSaga from '../../app/auth/auth.saga';
import LangSaga from '../../app/language/lang.saga';
import UserSaga from '../../app/user/saga.user';

export default function* rootSaga() {
  yield all([
    //user
    UserSaga.watchGetCreditCards(),
    UserSaga.setCardEmail(),
    UserSaga.watchGetUserParcels(),
    UserSaga.watchSetParcelLocation(),
    UserSaga.watchSetParcelDestination(),
    UserSaga.watchSetActiveInput(),
    UserSaga.watchSearchLocation(),
    UserSaga.watchGetPredictedLocationDetails(),
    UserSaga.watchResetInputs(),
    UserSaga.watchSetDistanceAndDuration(),
    UserSaga.watchGetCurrentLocation(),
    UserSaga.watchEnableAddCreditCardBtn(),
    UserSaga.watchAddCreditCard(),
    UserSaga.ChangePaymentMethod(),
    UserSaga.RemoveValidCard(),
    UserSaga.watchSetVariables(),
    UserSaga.watchCreateparcel(),
    UserSaga.watchSetDeliveryInProgress(),
    UserSaga.watchConfirmDelivery(),
    UserSaga.watchCancelDelivery(),
    UserSaga.watchUserLocation(),
    UserSaga.watchSetProfilePics(),
    UserSaga.watchSetLocationDetails(),

    //lang

    LangSaga.ChangeLanguage(),

    //resetpassword
    AuthSaga.watchSetNewpassword(),
    AuthSaga.watchSetConfirmNewpassword(),

    //confirm reset credentials
    AuthSaga.watchSetRessetPasswordPhoneNumber(),
    AuthSaga.watchConfirmPhoneNumber(),
    AuthSaga.watchResendCodeAuth(),
    AuthSaga.ressetPassword(),

    //verification
    AuthSaga.watchSetVerificationPin(),
    AuthSaga.watchSetTimerElapse(),
    AuthSaga.watchVerifyCodeSent(),

    //authentication Sagas
    AuthSaga.watchLogout(),
    AuthSaga.WatchLogin(),
    AuthSaga.WatchSetLoginPhoneNumber(),
    AuthSaga.watchSetLoginPassword(),

    //signup
    AuthSaga.watchSetSignUpFirstName(),
    AuthSaga.watchSetSignUpLastName(),
    AuthSaga.watchSetSignUpPassword(),
    AuthSaga.watchSetSignUpPhoneNumber(),
    AuthSaga.watchSetGender(),
    AuthSaga.watchSignUp(),
  ]);
}
