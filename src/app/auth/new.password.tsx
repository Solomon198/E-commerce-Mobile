import React from 'react';
import {SafeAreaView, StyleSheet, TextInput, View} from 'react-native';
import {Button, Text, H1} from 'native-base';
import Colors from '../../configs/styles/index';
import {connect} from 'react-redux';
import {RessetPasswordActionType} from '../../configs/global.enum';
import SpinKit from 'react-native-spinkit';

type Props = {
  newPassword: string;
  confirmNewPassword: string;
  componentId: string;
  ressetPassword: string;
  accessToken: string;
  ressetPasswordError: string;

  setNewPassword: (password: string) => void;
  setConfirmNewPassword: (password: string) => void;
  doRessetPassword: (payload: any, confirmNewPassword: string) => void;
};

const mapStateToProps = (store: any) => ({
  newPassword: store.Auth.newPassword,
  confirmNewPassword: store.Auth.confirmNewPassword,
  ressetPassword: store.Auth.ressetPassword,
  ressetPasswordError: store.Auth.ressetPasswordError,
  accessToken: store.Auth.accessToken,
});

const mapDispatchStateToProps = (dispatch: any) => ({
  setNewPassword: (password: string) =>
    dispatch({type: 'DO-SET-NEW-PASSWORD', payload: password}),
  setConfirmNewPassword: (password: string) =>
    dispatch({type: 'DO-SET-CONFIRM-NEW-PASSWORD', payload: password}),
  doRessetPassword: (payload: any, confirmNewPassword: string) =>
    dispatch({
      type: RessetPasswordActionType.RESSET_PASSWORD_CALLER,
      payload: payload,
      confirmNewPassword: confirmNewPassword,
    }),
});

class NewPassword extends React.Component<Props> {
  ressetPassword() {
    this.props.doRessetPassword(
      {
        password: this.props.newPassword,
        accessToken: this.props.accessToken,
      },
      this.props.confirmNewPassword,
    );
  }

  render() {
    const ressetPasswordStarted =
      this.props.ressetPassword ===
      RessetPasswordActionType.RESSET_PASSWORD_STARTED;

    return (
      <SafeAreaView style={styles.mainContainer}>
        <H1 style={styles.headerText}>
          {' '}
          <H1 style={[styles.headerText, {color: Colors.Brand.brandColor}]}>
            Enter
          </H1>{' '}
          New Password
        </H1>
        {this.props.ressetPasswordError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              {this.props.ressetPasswordError}
            </Text>
          </View>
        ) : null}

        <TextInput
          placeholderTextColor={'#555'}
          placeholder="Enter new password"
          style={styles.input}
          secureTextEntry
          value={this.props.newPassword}
          onChangeText={(text) => this.props.setNewPassword(text)}
        />

        <TextInput
          placeholderTextColor={'#555'}
          placeholder="Confirm new password"
          style={styles.input}
          secureTextEntry
          value={this.props.confirmNewPassword}
          onChangeText={(text) => this.props.setConfirmNewPassword(text)}
        />

        <Button
          disabled={ressetPasswordStarted}
          onPress={() => this.ressetPassword()}
          block
          large
          style={styles.verifyBtn}>
          <Text style={styles.text} uppercase={false}>
            Reset Password
          </Text>
          {ressetPasswordStarted && <SpinKit color="#fff" type="Circle" />}
        </Button>
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
  },
  headerText: {
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#f8f8f8',
    borderColor: Colors.Brand.getBrandColorByOpacity(0.4),
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 20,
    fontWeight: '500',
    marginHorizontal: 20,
    color: '#555',
    paddingVertical: 20,
    fontSize: 17,
  },

  verifyBtn: {
    marginHorizontal: 20,
    borderRadius: 5,
    backgroundColor: Colors.Brand.brandColor,
    marginTop: 20,
  },
});

export default connect(mapStateToProps, mapDispatchStateToProps)(NewPassword);
