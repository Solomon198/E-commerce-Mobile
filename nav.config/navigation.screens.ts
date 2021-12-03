enum NavigationScreens {
  //user pages
  SIDEMENU_SCREEN = 'stack.user.sidemenu',
  PARCEL_MANAGER_SCREEN = 'stack.user.parcelManger',
  DASHBOARD_SCREEN = 'stack.user.dashboard',
  NOTIFICATION_SCREEN = 'stack.user.notifications',
  CREATE_PARCEL_SCREEN = 'stack.user.createParcel',
  PARCEL_DELIVERY_CALCULATION_SCREEN = 'stack.user.calculate.cost',
  PARCEL_DELIVERY_CUSTOMERS_ORDERS_SCREEN = 'stack.user.customers.orders',
  PARCEL_DELIVERY_MY_ORDERS_SCREEN = 'stack.user.my.orders',
  PAYMENT_OPTION_SCREEN = 'stack.user.payment.options',
  CREDIT_CARD = 'stack.user.credit.card',
  USER_PROFILE = 'stack.user.profile',
  MONITOR_PARCEL_DELIVERY = 'stack.user.rtc.trip',
  //auth pages
  SIGNUP_SCREEN = 'stack.auth.signup',
  SIGNIN_SCREEN = 'stack.auth.signin',
  VERIFICATION_SCREEN = 'stack.auth.verification',
  VALIDATE_RESET_CREDENTIALS = 'stack.auth.validate.reset.credentials',
  NEW_PASSWORD_SCREEN = 'stack.auth.newPassword',
  SEARCH_PICKUP_SCREEN = 'stack.user.searchPickUp',
  SWITCH_SCREEN = 'stack.auto.switch',
}

export default NavigationScreens;
