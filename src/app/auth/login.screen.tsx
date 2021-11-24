import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import {Button, Text, Icon, Container} from 'native-base';
import StyleConfig from '../../configs/styles/index';
import {Navigation} from 'react-native-navigation';
import {connect} from 'react-redux';
import Language from '../../../language/index';
import Components from '../components/index';
import {inputActionType, loginActionType} from '../../configs/global.enum';
import SpinKit from 'react-native-spinkit';
import NavigationScreens from '../../../nav.config/navigation.screens';

type Props = {
  componentId: string;
  loginPhoneNumber: string;
  loginPassword: string;
  errorLogin: string;
  loginStatus: string;
  setPhoneNumber: (phoneNumber: string) => void;
  setPassword: (password: string) => void;
  login: (payload: any) => void;
  language: string;
  logout: () => void;
};

const mapStateToProps = (store: any) => ({
  loginPhoneNumber: store.Auth.loginPhoneNumber,
  loginPassword: store.Auth.loginPassword,
  language: store.Lang.language,
  loginStatus: store.Auth.login,
  errorLogin: store.Auth.errorLogin,
});

const mapDispatchToProps = (dispatch: any) => ({
  setPhoneNumber: (phoneNumber: string) =>
    dispatch({
      type: inputActionType.SET_LOGIN_PHONE_NUMBER_CALLER,
      payload: phoneNumber,
    }),
  setPassword: (password: string) =>
    dispatch({
      type: inputActionType.SET_LOGIN_PASSWORD_CALLER,
      payload: password,
    }),
  login: (payload: any) =>
    dispatch({type: loginActionType.LOGIN_CALLER, payload: payload}),
});

const styles = StyleSheet.create({
  btnIcon: {
    color: '#fff',
  },
  mainContainer: {
    marginTop: 30,
    backgroundColor: 'transparent',
    color: '#000000',
    flex: 3,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  createAccount: {
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
    textAlign: 'center',
    fontSize: 40,
    lineHeight: 40,
    marginTop: 40,
  },
  input: {
    borderColor: '#e8e8e8',
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingVertical: 17,
    fontSize: 17,
    color: '#fff',
    borderRadius: 50,
  },
  form: {
    marginHorizontal: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: 10,
  },
  itemStyle: {
    borderColor: 'transparent',
  },
  btn: {
    marginVertical: 5,
    backgroundColor: StyleConfig.Brand.getBrandColorByOpacity(0.9),
    borderColor: 'transparent',
    paddingVertical: 30,
  },

  title: {
    color: '#555',
    fontWeight: 'bold',
  },

  btnText: {
    letterSpacing: 2,
    fontWeight: 'bold',
  },
  svgCurve: {
    position: 'absolute',
    width: Dimensions.get('window').width,
  },
  logoContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 20,
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
  flexContainer: {flex: 1},
  errorContainer: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 5,
    borderRadius: 5,
    marginTop: -10,
  },
  errorText: {color: 'red'},
  inputExtended: {backgroundColor: '#fff'},
  ressetBtn: {alignSelf: 'flex-end', color: '#555'},
});

class Login extends React.Component<Props> {
  static accessToken = 'welcome';

  componentDidMount() {}

  createAccount() {
    Navigation.push(this.props.componentId, {
      component: {
        id: NavigationScreens.SIGNUP_SCREEN,
        name: NavigationScreens.SIGNUP_SCREEN,
      },
    });
  }

  resetPassword() {
    Navigation.push(this.props.componentId, {
      component: {
        name: NavigationScreens.VALIDATE_RESET_CREDENTIALS,
        id: NavigationScreens.VALIDATE_RESET_CREDENTIALS,
      },
    });
  }

  login() {
    this.props.login({
      phoneNumber: this.props.loginPhoneNumber,
      password: this.props.loginPassword,
      countryCode: 'NG',
    });
  }

  render() {
    const loginText = Language(this.props.language).LoginScreen;
    const loginStarted =
      this.props.loginStatus === loginActionType.LOGIN_STARTED;

    return (
      <SafeAreaView style={styles.flexContainer}>
        <StatusBar backgroundColor={StyleConfig.Brand.brandColor} />
        <Components.WaveHeader
          customStyles={styles.svgCurve}
          customHeight={210}
          customTop={160}
          customBgColor={StyleConfig.Brand.brandColor}
          customWavePattern="M0,160L48,154.7C96,149,192,139,288,149.3C384,160,480,192,576,218.7C672,245,768,267,864,277.3C960,288,1056,288,1152,266.7C1248,245,1344,203,1392,181.3L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
        />
        <View style={styles.flexContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../../assets/media/images/logo.png')}
              style={styles.logo}
            />
          </View>
          <Container style={styles.mainContainer}>
            {this.props.errorLogin ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{this.props.errorLogin}</Text>
              </View>
            ) : null}

            <TextInput
              editable={!loginStarted}
              value={this.props.loginPhoneNumber}
              placeholder={loginText.PHONE_INPUT_PLACE_HOLDER}
              style={[StyleConfig.Components.InputStyles, styles.inputExtended]}
              keyboardType="number-pad"
              onChangeText={(text) => this.props.setPhoneNumber(text)}
            />

            <TextInput
              editable={!loginStarted}
              value={this.props.loginPassword}
              placeholder={loginText.PASSWORD_INPUT_PLACE_HOLDER}
              onChangeText={(text) => this.props.setPassword(text)}
              secureTextEntry
              style={[StyleConfig.Components.InputStyles, styles.inputExtended]}
            />

            <Button
              disabled={loginStarted}
              onPress={() => this.login()}
              style={styles.btn}
              rounded
              block
              iconLeft>
              <Icon style={styles.btnIcon} type="AntDesign" name="login" />
              <Text uppercase={false} style={styles.btnText}>
                {loginText.LOGIN_BUTTON_TEXT}
              </Text>
              {loginStarted && <SpinKit color="#fff" type="Circle" />}
            </Button>
            <Button
              disabled={loginStarted}
              onPress={() => this.createAccount()}
              block
              iconLeft
              rounded
              style={styles.btn}>
              <Icon style={styles.btnIcon} name="create-outline" />
              <Text uppercase={false} style={styles.btnText}>
                {loginText.CREATE_ACCOUNT}
              </Text>
            </Button>

            <TouchableOpacity
              disabled={loginStarted}
              onPress={() => this.resetPassword()}>
              <Text style={[styles.title, styles.ressetBtn]}>
                {loginText.FORGET_PASSWORD_TEXT}
              </Text>
            </TouchableOpacity>
          </Container>
        </View>
      </SafeAreaView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
