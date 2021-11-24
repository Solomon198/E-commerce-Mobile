/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {Alert, SafeAreaView} from 'react-native';
import {connect} from 'react-redux';
import {AuthNavigationSettingStack, User} from './nav.config/nav.stack';
import RNPaystack from 'react-native-paystack';
import {PAYSTACK_PUBLIC} from 'react-native-dotenv';
import SplashScreen from 'react-native-splash-screen';

RNPaystack.init({
  publicKey: PAYSTACK_PUBLIC,
});

type Props = {
  user: any;
  accessToken: string;
  test: () => void;
};

const mapStateToProps = (store: any) => ({
  user: store.Auth.user,
  accessToken: store.Auth.accessToken,
});

const mapDispatchStateToProps = () => ({
  test: () => Alert.alert('working'),
});

class App extends React.Component<Props> {
  componentDidMount() {
    if (!this.props.accessToken) {
      AuthNavigationSettingStack();
    } else {
      User();
    }

    SplashScreen.hide();
  }

  render() {
    return <SafeAreaView></SafeAreaView>;
  }
}

export default connect(mapStateToProps, mapDispatchStateToProps)(App);
