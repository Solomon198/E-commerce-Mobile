import React from 'react';
import {View, StyleSheet, TouchableOpacity, Modal, Alert} from 'react-native';
import {H1, Container, H2, Body, Icon, Header, Button, Left} from 'native-base';
import Colors from '../../configs/styles/index';
import {Navigation} from 'react-native-navigation';
import {connect} from 'react-redux';
import {Avatar} from 'react-native-ui-lib';
import User from '../types/user';
import SpinKit from 'react-native-spinkit';
import {getDefaultProfilePicture} from '../utilities/helper.funcs';
import Utils from '../utilities/index';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import {appUrl, firebasePaths} from '../../configs/globals.config';
import {inputActionType} from '../../configs/global.enum';
import axios from 'axios';
import crashlytics from '@react-native-firebase/crashlytics';

const firebaseStorage = storage;

type Props = {
  user: User;
  componentId: string;

  setProfilePicture: (url: string) => void;
};

const mapStateToProps = (store: any) => ({
  user: store.Auth.user,
});

const mapDispatchStateToProps = (dispatch: any) => ({
  setProfilePicture: (url: string) =>
    dispatch({type: inputActionType.SET_PROFILE_PICTURE_CALLER, payload: url}),
});

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#f4f4f4',
    flex: 1,
  },
  input: {
    borderColor: '#e8e8e8',
    borderWidth: 1,
    backgroundColor: '#fafafa',
    fontSize: 17,
  },
  uploadAction: {
    fontFamily: 'sans-serif-light',
    marginVertical: 50,
    fontSize: 19,
    fontWeight: 'bold',
    color: Colors.Brand.brandColor,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 20,
  },
  uploaderContainer: {justifyContent: 'center', alignItems: 'center'},
  progressPercentage: {
    position: 'absolute',
    fontWeight: 'bold',
    color: Colors.Brand.brandColor,
  },
  header: {backgroundColor: '#f4f4f4'},
  headerLeft: {maxWidth: 50},
  avatarContainer: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadImageTouchableView: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#999',
    position: 'absolute',
    right: 100,
  },
  userName: {marginTop: 10, color: '#555'},
  userEmail: {fontSize: 15},
  userPhoneNumber: {
    color: Colors.Brand.brandColor,
    fontFamily: 'sans-serif-light',
    fontSize: 20,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 20,
  },
});

class Profile extends React.Component<Props> {
  state = {
    count: 0,
    totalPercentage: 0,
    modalVisible: false,
    uploadState: '',
  };
  goBack() {
    Navigation.pop(this.props.componentId);
  }

  renderUploader() {
    return (
      <Modal transparent visible={this.state.modalVisible}>
        <View style={styles.modal}>
          <View style={styles.uploaderContainer}>
            <SpinKit size={200} type="Circle" color={Colors.Brand.brandColor} />
            <H2 style={styles.progressPercentage}>
              {this.state.totalPercentage.toFixed(0) + '%'}
            </H2>
          </View>
          <H1 style={styles.uploadAction}>{this.state.uploadState} </H1>
        </View>
      </Modal>
    );
  }

  async savingProfilePicture(url: string) {
    try {
      await axios.put(appUrl + '/update/user/profile', {
        userId: this.props.user.userId,
        updates: {photo: url},
      });

      this.setState({modalVisible: false}, () => {
        this.props.setProfilePicture(url);
        Alert.alert('', 'Profile picture changed successfully!! ');
      });
    } catch (e) {
      console.log(e);
      crashlytics().log('unable to save or send profile picture to backend');
      crashlytics().recordError(e);
      Alert.alert('Unable to set profile picture please try again.');
    }
  }

  upload(media: string) {
    this.setState({uploading: true});

    let $task = firebaseStorage()
      .ref('/profile/medias/user')
      .child('Img' + this.props.user.userId)
      .putFile(media);

    $task.on('state_changed', (task) => {
      let percentageUploaded = (task.bytesTransferred / task.totalBytes) * 100;
      this.setState({totalPercentage: percentageUploaded});
    });

    $task.then(() => {
      $task.snapshot?.ref
        .getDownloadURL()
        .then((url) => {
          this.setState({uploadState: 'Saving profile picture ... '}, () => {
            //update app state;
            this.savingProfilePicture(url);
          });
        })
        .catch((e) => {
          crashlytics().log('could not get download url for uploaded task');
          crashlytics().recordError(e);
        });
    });

    $task.catch((e) => {
      crashlytics().log('uploading image failed');
      crashlytics().recordError(e);
      this.setState({modalVisible: false}, () => {
        Alert.alert('', 'unable to upload profile photo');
      });
    });
  }

  uploadProfilePic() {
    Utils.Helpers.getImageFromGallery()
      .then((url) => {
        this.setState(
          {modalVisible: true, uploadState: 'Uploading Profile Picture ....'},
          () => {
            this.upload(url as string);
          },
        );
      })
      .catch((e) => {
        crashlytics().log('uploading error');
        crashlytics().recordError(e);
        Alert.alert('', 'unable to upload profile photo');
      });
  }

  render() {
    return (
      <Container style={styles.mainContainer}>
        {this.renderUploader()}
        <Header
          androidStatusBarColor={Colors.Brand.brandColor}
          hasTabs
          style={styles.header}>
          <Left style={styles.headerLeft}>
            <Button onPress={() => this.goBack()} dark transparent>
              <Icon
                name="arrow-back"
                style={{color: Colors.Brand.brandColor}}
              />
            </Button>
          </Left>
          <Body />
        </Header>
        <View style={styles.avatarContainer}>
          <Avatar
            onPress={() => ''}
            size={150}
            source={
              this.props.user.photo
                ? {uri: this.props.user.photo}
                : getDefaultProfilePicture(this.props.user.gender)
            }
          />
          <TouchableOpacity
            onPress={() => this.uploadProfilePic()}
            style={styles.uploadImageTouchableView}>
            <Icon name="camera" style={{color: Colors.Brand.brandColor}} />
          </TouchableOpacity>
          <H1 style={styles.userName}>
            {this.props.user.firtName + ' ' + this.props.user.lastName}
          </H1>

          <H2 style={styles.userEmail}>{this.props.user.email}</H2>

          <H2 style={styles.userPhoneNumber}>{this.props.user.phoneNumber}</H2>
        </View>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchStateToProps)(Profile);
