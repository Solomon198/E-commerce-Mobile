import {Navigation} from 'react-native-navigation';
import App from '../switchNav';
import ReduxConfig from '../src/configs/_redux/store';
import {Provider} from 'react-redux';
import React from 'react';
import {PersistGate} from 'redux-persist/integration/react';
import Login from '../src/app/auth/login.screen';
import SignUp from '../src/app/auth/signup.screen';
import Verification from '../src/app/auth/verification.screen';
import ValidateResetPasswordCreds from '../src/app/auth/collect.phone.reset.password';
import NewPassword from '../src/app/auth/new.password';

//user navigations
import UserSideMenu from '../src/app/user/side.menu';
import CustomersOrders from '../src/app/user/customers.orders';
import MyOrders from '../src/app/user/my.orders';
import UserParcelManager from '../src/app/user/status.parcels';
import UserDashboard from '../src/app/user/main.dashboard';
import UserNotifications from '../src/app/user/manager.notifications';
import CreateParcel from '../src/app/user/create.parcel';
import CalculatorParcel from '../src/app/user/calculator.location';
import SearchPickUp from '../src/app/user/search.pickup';
import PaymentOption from '../src/app/user/payment.options';
import CreditCard from '../src/app/user/credit.card';
import Profile from '../src/app/user/user.profile';
import NavigationScreens from './navigation.screens';

export const {persistor, store} = ReduxConfig();

function Wrapper(Component: any) {
  return function (props: any) {
    const EnhancedComponent = () => (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Component {...props} />
        </PersistGate>
      </Provider>
    );
    return <EnhancedComponent />;
  };
}

export default function InitializeScreens() {
  Navigation.registerComponent(
    NavigationScreens.SWITCH_SCREEN,
    () => Wrapper(App) as any,
  );

  Navigation.registerComponent(
    NavigationScreens.PARCEL_DELIVERY_CUSTOMERS_ORDERS_SCREEN,
    () => Wrapper(CustomersOrders) as any,
  );

  Navigation.registerComponent(
    NavigationScreens.PARCEL_DELIVERY_MY_ORDERS_SCREEN,
    () => Wrapper(MyOrders) as any,
  );

  //UserPages
  Navigation.registerComponent(
    NavigationScreens.SIDEMENU_SCREEN,
    () => Wrapper(UserSideMenu) as any,
  );

  Navigation.registerComponent(
    NavigationScreens.PARCEL_MANAGER_SCREEN,
    () => Wrapper(UserParcelManager) as any,
  );
  Navigation.registerComponent(
    NavigationScreens.DASHBOARD_SCREEN,
    () => Wrapper(UserDashboard) as any,
  );
  Navigation.registerComponent(
    NavigationScreens.NOTIFICATION_SCREEN,
    () => Wrapper(UserNotifications) as any,
  );
  Navigation.registerComponent(
    NavigationScreens.CREATE_PARCEL_SCREEN,
    () => Wrapper(CreateParcel) as any,
  );
  Navigation.registerComponent(
    NavigationScreens.PARCEL_DELIVERY_CALCULATION_SCREEN,
    () => Wrapper(CalculatorParcel) as any,
  );
  Navigation.registerComponent(
    NavigationScreens.PAYMENT_OPTION_SCREEN,
    () => Wrapper(PaymentOption) as any,
  );
  Navigation.registerComponent(
    NavigationScreens.CREDIT_CARD,
    () => Wrapper(CreditCard) as any,
  );
  Navigation.registerComponent(
    NavigationScreens.USER_PROFILE,
    () => Wrapper(Profile) as any,
  );

  //Auth Pages
  Navigation.registerComponent(
    NavigationScreens.SIGNIN_SCREEN,
    () => Wrapper(Login) as any,
  );
  Navigation.registerComponent(
    NavigationScreens.SIGNUP_SCREEN,
    () => Wrapper(SignUp) as any,
  );

  Navigation.registerComponent(
    NavigationScreens.VERIFICATION_SCREEN,
    () => Wrapper(Verification) as any,
  );
  Navigation.registerComponent(
    NavigationScreens.VALIDATE_RESET_CREDENTIALS,
    () => Wrapper(ValidateResetPasswordCreds) as any,
  );
  Navigation.registerComponent(
    NavigationScreens.NEW_PASSWORD_SCREEN,
    () => Wrapper(NewPassword) as any,
  );
  Navigation.registerComponent(
    NavigationScreens.SEARCH_PICKUP_SCREEN,
    () => Wrapper(SearchPickUp) as any,
  );
}
