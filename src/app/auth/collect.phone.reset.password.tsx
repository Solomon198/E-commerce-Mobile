import React from 'react';
import {SafeAreaView, StyleSheet, TextInput, View} from 'react-native';
import {Button, Text, H1} from 'native-base';
import Colors from '../../configs/styles/index';
import {connect} from 'react-redux';
import lang from '../../../language/index';
import {verificationActionType} from '../../configs/global.enum';
import SpinKit from 'react-native-spinkit';

type Props = {
  componentId: string;
  resetPhoneNumber: string;
  language: string;
  verificationError: string;
  verification: string;
  setResetPhoneNumber: (phoneNumber: string) => void;
  verifyPhoneNumber: (payload: any) => void;
};

const mapStateToProps = (store: any) => ({
  resetPhoneNumber: store.Auth.resetPhoneNumber,
  language: store.Lang.language,
  verification: store.Auth.verification,
  verificationError: store.Auth.verificationError,
});

const mapDispatchStateToProps = (dispatch: any) => ({
  verifyPhoneNumber: (payload: any) =>
    dispatch({
      type: verificationActionType.SEND_VERIFICATION_CODE_CALLER,
      payload: payload,
      resetPasswordFlow: true,
    }),
  setResetPhoneNumber: (phoneNumber: string) =>
    dispatch({
      type: 'DO-SET-RESSET-PASSWORD-PHONE-NUMBER',
      payload: phoneNumber,
    }),
});

class VerifyResetCreds extends React.Component<Props> {
  verifyNumber() {
    this.props.verifyPhoneNumber({
      phoneNumber: this.props.resetPhoneNumber,
      countryCode: 'NG',
    });
  }

  render() {
    const langText = lang(this.props.language);
    const verifyPasswordRessetNum = langText.VerifyNum;
    const getCodeStarted =
      this.props.verification ===
      verificationActionType.SEND_VERIFICATION_CODE_STARTED;

    return (
      <SafeAreaView style={styles.mainContainer}>
        <H1 style={styles.headerText}>{verifyPasswordRessetNum.HEADER_TEXT}</H1>

        {this.props.verificationError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{this.props.verificationError}</Text>
          </View>
        ) : null}

        <TextInput
          placeholderTextColor={Colors.Brand.brandColor}
          placeholder="- - - - - - - - - - - - - "
          style={styles.input}
          keyboardType="number-pad"
          value={this.props.resetPhoneNumber}
          onChangeText={(text) => this.props.setResetPhoneNumber(text)}
        />

        <Button
          disabled={getCodeStarted}
          onPress={() => this.verifyNumber()}
          block
          large
          style={styles.verifyBtn}>
          <Text style={styles.text} uppercase={false}>
            {verifyPasswordRessetNum.VERIFY_BUTTON}
          </Text>
          {getCodeStarted && <SpinKit color="#fff" type="Circle" />}
        </Button>

        <Text style={styles.verificationText}>
          {verifyPasswordRessetNum.VERIFICATION_DESC}
        </Text>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
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
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
    marginTop: 30,
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
export default connect(
  mapStateToProps,
  mapDispatchStateToProps,
)(VerifyResetCreds);
