import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
  Keyboard,
} from 'react-native';
import {Button, Text, H1, Icon} from 'native-base';
import Colors from '../../configs/styles/index';
import CountDown from 'react-native-countdown-component';
import {connect} from 'react-redux';
import lang from '../../../language/index';
import User from '../types/user';
import {
  verificationActionType,
  verifyingCodeAction,
} from '../../configs/global.enum';
import SpinKit from 'react-native-spinkit';

type Props = {
  componentId: string;
  verificationPin: string;
  verificationToken: string;
  timerElapse: boolean;
  countdownComponentId: string;
  language: string;
  user: User;
  phoneNumber: string;
  verification: string;
  verificationError: string;
  verifyingPin: string;
  resetPasswordFlow: boolean;
  ressetPhoneNumber: string;

  setVerificationPin: (pin: string) => void;
  setTimerElapse: () => void;
  resendCode: (payload: any) => void;
  verifyPin: (payload: any, flow: boolean) => void;
};

const mapStateToProps = (store: any) => ({
  verificationPin: store.Auth.verificationPin,
  timerElapse: store.Auth.timerElapse,
  countdownComponentId: store.Auth.countdownComponentId,
  language: store.Lang.language,
  verification: store.Auth.verification,
  user: store.Auth.user,
  verificationError: store.Auth.verificationError,
  phoneNumber: store.Auth.phoneNumber,
  verificationToken: store.Auth.verificationToken,
  verifyingPin: store.Auth.verifyingPin,
});

const mapDispatchStateToProps = (dispatch: any) => ({
  setVerificationPin: (pin: string) =>
    dispatch({type: 'DO-SET-VERIFICATION-PIN', payload: pin}),
  setTimerElapse: () => dispatch({type: 'DO-SET-TIMER-ELAPSE'}),
  resendCode: (payload: any) =>
    dispatch({
      type: verificationActionType.SEND_VERIFICATION_CODE_CALLER,
      payload: payload,
    }),
  verifyPin: (payload: any, flow: boolean) =>
    dispatch({
      type: verifyingCodeAction.VERIFYING_CODE_CALLER,
      payload,
      resetPasswordFlow: flow,
    }),
});

class Verification extends React.Component<Props> {
  resetTimer() {
    this.setState({time: 10, showOptions: false});
  }

  sendVoiceCall() {
    this.props.resendCode({});
  }

  verifyPin() {
    Keyboard.dismiss();
    let payload = {
      pin: this.props.verificationPin,
      token: this.props.verificationToken,
    };
    this.props.verifyPin(payload, this.props.resetPasswordFlow);
  }

  resendSMS() {
    this.props.resendCode({
      phoneNumber: this.props.phoneNumber || this.props.ressetPhoneNumber,
      countryCode: 'NG',
    });
  }

  componentDidMount() {
    console.log(this.props.verificationToken);
  }

  render() {
    const langText = lang(this.props.language);
    const confirmCodeText = langText.ConfirmCode;
    const getCodeStarted =
      this.props.verification ===
      verificationActionType.SEND_VERIFICATION_CODE_STARTED;
    const verifyPinStarted =
      this.props.verifyingPin === verifyingCodeAction.VERIFYING_CODE_STARTED;
    return (
      <SafeAreaView style={styles.mainContainer}>
        {this.props.verificationError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{this.props.verificationError}</Text>
          </View>
        ) : null}

        {this.props.verification ===
        verificationActionType.SEND_VERIFICATION_CODE_SUCCESS ? (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>
              {confirmCodeText.VERIFICATION_CODE_SENT}
            </Text>
          </View>
        ) : null}
        <H1 style={styles.headerText}>
          {confirmCodeText.CONFIRM_CODE_HEADER_TEXT}
        </H1>

        <TextInput
          placeholderTextColor={Colors.Brand.brandColor}
          placeholder="- - - -"
          style={styles.input}
          maxLength={4}
          keyboardType="number-pad"
          value={this.props.verificationPin}
          onChangeText={(text) => this.props.setVerificationPin(text)}
        />

        <Button
          onPress={() => this.verifyPin()}
          disabled={getCodeStarted || verifyPinStarted ? true : false}
          block
          large
          style={styles.verifyBtn}>
          <Text style={styles.text} uppercase={false}>
            {confirmCodeText.VERIFY_CODE_BUTTON_TEXT}
          </Text>
          {verifyPinStarted && <SpinKit color="#fff" type="Circle" />}
        </Button>

        <Text style={styles.verificationText}>
          {confirmCodeText.CONFIRMATION_DESCRIPTION}
        </Text>
        {!this.props.timerElapse ? (
          <CountDown
            id={this.props.countdownComponentId}
            until={3 * 60}
            size={30}
            onFinish={() => this.props.setTimerElapse()}
            digitStyle={{backgroundColor: Colors.Brand.brandColor}}
            digitTxtStyle={styles.countDownDigit}
            timeToShow={['H', 'M', 'S']}
            timeLabels={{
              m: confirmCodeText.TIME_LABEL_MINUTES,
              s: confirmCodeText.TIME_LABEL_SECONDS,
              h: confirmCodeText.TIME_LABEL_HOUR,
            }}
          />
        ) : (
          <View style={styles.resendBtnContainer}>
            <Button
              disabled={getCodeStarted || verifyPinStarted ? true : false}
              onPress={() => this.resendSMS()}
              iconLeft
              block
              style={styles.options}>
              <Icon type="FontAwesome5" name="sms" />
              <Text>{confirmCodeText.CONFIRMATION_OPTION_BUTTON_SMS}</Text>
              {getCodeStarted && <SpinKit color="#fff" type="Circle" />}
            </Button>
            {/* <Button onPress={()=>this.sendVoiceCall()} iconLeft block style={styles.options}>
                             <Icon type="MaterialIcons" name="keyboard-voice"/>
                             <Text>
                                 {confirmCodeText.CONFIRMATION_OPITON_BUTTON_VOICE}
                             </Text>
                         </Button> */}
          </View>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  resendBtnContainer: {marginHorizontal: 20},
  countDownDigit: {color: '#fff'},
  successText: {color: 'forestgreen', textAlign: 'center'},
  successContainer: {
    backgroundColor: '#f4f4f4',
    padding: 5,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  errorText: {color: 'red', textAlign: 'center'},
  errorContainer: {
    backgroundColor: '#f4f4f4',
    padding: 5,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  options: {
    backgroundColor: Colors.Brand.brandColor,
    marginTop: 15,
    borderRadius: 5,
  },
  verificationText: {
    color: '#444',
    marginHorizontal: 20,
    marginTop: 10,
    fontSize: 14,
    marginBottom: 30,
  },
  text: {
    fontSize: 18,
    fontWeight: '800',
  },
  mainContainer: {
    backgroundColor: '#fff',
    flex: 1,
    paddingHorizontal: 5,
  },
  headerText: {
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
    marginTop: 40,
  },
  input: {
    backgroundColor: 'transparent',
    marginTop: 20,
    textAlign: 'center',
    fontSize: 40,
    fontWeight: 'bold',
    color: Colors.Brand.brandColor,
  },

  verifyBtn: {
    marginHorizontal: 20,
    borderRadius: 5,
    backgroundColor: Colors.Brand.brandColor,
  },
});

export default connect(mapStateToProps, mapDispatchStateToProps)(Verification);
