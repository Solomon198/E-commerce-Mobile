import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
  ScrollView,
} from 'react-native';
import {Button, Text, H1, Icon, Header, Body, Right, Radio} from 'native-base';
import StylesConfig from '../../configs/styles/index';
import {Navigation} from 'react-native-navigation';
import {connect} from 'react-redux';
import lang from '../../../language/index';
import {
  gender,
  inputActionType,
  signUpActionType,
} from '../../configs/global.enum';
import SpinKit from 'react-native-spinkit';
import UserType from '../types/user';
type Props = {
  componentId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
  gender: string;
  language: string;
  signUpStatus: string;
  errorSignUp: string;
  user: UserType;

  setFirstName: (firstName: string) => void;
  setLastName: (lastName: string) => void;
  setPhoneNumber: (phoneNumber: string) => void;
  setPassword: (password: string) => void;
  setGender: (gender: string) => void;
  signUp: (payload: any) => void;
};

const mapStateToProps = (store: any) => ({
  firstName: store.Auth.firstName,
  lastName: store.Auth.lastName,
  phoneNumber: store.Auth.phoneNumber,
  password: store.Auth.password,
  gender: store.Auth.gender,
  language: store.Lang.language,
  signUpStatus: store.Auth.signUp,
  errorSignUp: store.Auth.errorSignUp,
  user: store.Auth.user,
});

const mapDispatchStateToProps = (dispatch: any) => ({
  setFirstName: (firstName: string) =>
    dispatch({type: inputActionType.SET_FIRST_NAME_CALLER, payload: firstName}),
  setLastName: (lastName: string) =>
    dispatch({type: inputActionType.SET_LAST_NAME_CALLER, payload: lastName}),
  setPhoneNumber: (phoneNumber: string) =>
    dispatch({
      type: inputActionType.SET_SIGNUP_PHONE_NUMBER_CALLER,
      payload: phoneNumber,
    }),
  setPassword: (password: string) =>
    dispatch({
      type: inputActionType.SET_SIGNUP_PASSWORD_CALLER,
      payload: password,
    }),
  setGender: (userGender: string) =>
    dispatch({type: inputActionType.SET_GENDER_CALLER, payload: userGender}),
  signUp: (payload: any) =>
    dispatch({type: signUpActionType.SIGNUP_CALLER, payload: payload}),
});

class SignUp extends React.Component<Props> {
  async login() {
    await Navigation.pop(this.props.componentId);
  }

  signUp() {
    let payload = {
      phoneNumber: this.props.phoneNumber,
      firstName: this.props.firstName,
      lastName: this.props.lastName,
      gender: this.props.gender,
      password: this.props.password,
      countryCode: 'NG',
    };

    this.props.signUp(payload);
  }

  componentDidMount() {}

  render() {
    const langText = lang(this.props.language);
    const signupText = langText.SignUp;
    const signUpStarted =
      this.props.signUpStatus === signUpActionType.SIGNUP_STARTED;

    return (
      <SafeAreaView style={styles.flexContainer}>
        <View style={styles.flexContainer}>
          <Header
            hasTabs
            androidStatusBarColor={StylesConfig.Brand.brandColor}
            style={styles.header}>
            <Body />
            <Right>
              <Button
                iconLeft
                onPress={() => this.login()}
                rounded
                style={{
                  backgroundColor: StylesConfig.Brand.getBrandColorByOpacity(
                    0.7,
                  ),
                }}>
                <Icon
                  style={styles.headerRightIcon}
                  type="Octicons"
                  name="person"
                />
                <Text style={styles.loginText} uppercase={false}>
                  {langText.LoginScreen.LOGIN_BUTTON_TEXT}
                </Text>
              </Button>
            </Right>
          </Header>
          <ScrollView style={styles.mainContainer}>
            <H1 style={[styles.title, styles.signUpHeader]}>
              {signupText.CREATE_ACCOUNT_TEXT}
            </H1>

            {this.props.errorSignUp ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{this.props.errorSignUp}</Text>
              </View>
            ) : null}
            <View style={styles.nameFields}>
              <TextInput
                placeholder={signupText.INPUT_PLACEHOLDER_FIRST_NAME}
                value={this.props.firstName}
                onChangeText={(text) => this.props.setFirstName(text)}
                style={[
                  StylesConfig.Components.InputStyles,
                  styles.inputExtendFirstName,
                ]}
              />

              <TextInput
                placeholder={signupText.INPUT_PLACEHOLDER_LAST_NAME}
                value={this.props.lastName}
                onChangeText={(text) => this.props.setLastName(text)}
                style={[
                  StylesConfig.Components.InputStyles,
                  styles.flexContainer,
                ]}
              />
            </View>

            <TextInput
              placeholder={signupText.INPUT_PLACEHOLDER_PHONE_NUMBER}
              value={this.props.phoneNumber}
              keyboardType="number-pad"
              onChangeText={(text) => this.props.setPhoneNumber(text)}
              style={StylesConfig.Components.InputStyles}
            />

            <TextInput
              onChangeText={(text) => this.props.setPassword(text)}
              value={this.props.password}
              secureTextEntry
              placeholder={signupText.INPUT_PLACEHOLDER_PASSWORD}
              style={StylesConfig.Components.InputStyles}
            />

            <View style={styles.genderRadioContainer}>
              <View style={styles.radioContainer}>
                <Radio
                  onPress={() => this.props.setGender(gender.MALE)}
                  style={styles.radio}
                  selected={this.props.gender === gender.MALE}
                  color={StylesConfig.Brand.brandColor}
                  selectedColor={StylesConfig.Brand.brandColor}
                />

                <Text style={styles.title}>
                  {signupText.RADIO_TEXT_GENDER_MALE}
                </Text>
              </View>

              <View style={styles.radioContainer}>
                <Radio
                  selected={this.props.gender === gender.FEMALE}
                  onPress={() => this.props.setGender(gender.FEMALE)}
                  style={styles.radio}
                  color={StylesConfig.Brand.brandColor}
                  selectedColor={StylesConfig.Brand.brandColor}
                />
                <Text style={styles.title}>
                  {signupText.RADIO_TEXT_GENDER_FEMALE}
                </Text>
              </View>
            </View>

            <Button
              onPress={() => this.signUp()}
              disabled={signUpStarted}
              style={styles.btn}
              rounded
              block
              iconLeft>
              <Icon type="FontAwesome" name="sign-in" />
              <Text style={styles.btnText}>
                {signupText.CREATE_ACCOUNT_TEXT}
              </Text>
              {signUpStarted && <SpinKit color="#fff" type="Circle" />}
            </Button>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  genderRadioContainer: {flexDirection: 'row', marginTop: 10},
  inputExtendFirstName: {flex: 1, marginRight: 5},
  errorText: {color: 'red'},
  errorContainer: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 5,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 10,
  },
  signUpHeader: {
    marginBottom: 10,
    fontWeight: 'bold',
    marginVertical: 30,
  },
  loginText: {fontWeight: 'bold'},
  headerRightIcon: {fontSize: 14},
  header: {backgroundColor: 'transparent'},
  flexContainer: {flex: 1},
  mainContainer: {
    backgroundColor: 'transparent',
    color: '#000000',
    flex: 1,
    paddingHorizontal: 20,
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
    marginHorizontal: 4,
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
    marginVertical: 20,
    backgroundColor: StylesConfig.Brand.getBrandColorByOpacity(0.7),
    borderColor: 'transparent',
    paddingVertical: 30,
  },

  title: {
    color: '#666',
  },

  btnText: {
    letterSpacing: 2,
    fontWeight: 'bold',
  },

  nameFields: {
    flexDirection: 'row',
  },

  radioContainer: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginVertical: 3,
  },

  radio: {
    marginRight: 10,
  },
});
export default connect(mapStateToProps, mapDispatchStateToProps)(SignUp);
