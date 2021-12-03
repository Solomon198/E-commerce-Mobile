import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  ImageBackground,
  StatusBar,
} from 'react-native';
import {
  H1,
  Container,
  H2,
  Body,
  Icon,
  Header,
  Button,
  Left,
  Text,
  Fab,
} from 'native-base';
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
import NavigationScreens from '../../../nav.config/navigation.screens';

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
  labelProfileItems: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 5,
  },
  mainContainer: {
    backgroundColor: '#fff',
    flex: 1,
  },
  fab: {
    backgroundColor: '#fff',
    zIndex: 10000,
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
  header: {backgroundColor: 'transparent'},
  headerLeft: {maxWidth: 50},
  avatarContainer: {
    flex: 1,
    marginHorizontal: 20,
    justifyContent: 'center',
  },
  uploadImageTouchableView: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#999',
    margin: 20,
    alignSelf: 'flex-end',
  },
  userName: {marginTop: 15, color: '#444', fontWeight: 'bold'},
  userEmail: {fontSize: 15},
  userPhoneNumber: {
    color: Colors.Brand.brandColor,
    fontFamily: 'sans-serif-light',
    fontSize: 14,
    borderRadius: 20,
    fontWeight: '900',
    marginTop: 3,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 10,
  },
  accountActions: {
    backgroundColor: '#f4f4f4',
    width: 60,
    height: 60,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    justifyContent: 'center',
    alignItems: 'center',
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
        <StatusBar translucent />
        {this.renderUploader()}
        <View style={{flex: 2}}>
          <Fab
            active={true}
            style={styles.fab}
            position="topLeft"
            onPress={() => this.goBack()}>
            <Icon style={{color: Colors.Brand.brandColor}} name="arrow-back" />
          </Fab>
          <ImageBackground
            resizeMethod="resize"
            resizeMode="cover"
            style={{flex: 1}}
            imageStyle={{borderRadius: 15, margin: 2}}
            source={
              this.props.user.photo
                ? {uri: this.props.user.photo}
                : getDefaultProfilePicture(this.props.user.gender)
            }>
            {/* <Header
              translucent
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
            </Header> */}
            <View style={{flex: 1}} />
            <TouchableOpacity
              onPress={() => this.uploadProfilePic()}
              style={styles.uploadImageTouchableView}>
              <Icon name="camera" style={{color: Colors.Brand.brandColor}} />
            </TouchableOpacity>
          </ImageBackground>
        </View>
        <View style={styles.avatarContainer}>
          {/* <Avatar
            onPress={() => ''}
            size={150}
            source={
              this.props.user.photo
                ? {uri: this.props.user.photo}
                : getDefaultProfilePicture(this.props.user.gender)
            }
          /> */}

          <H1 style={styles.userName}>
            {this.props.user.firtName + ' ' + this.props.user.lastName}
          </H1>

          <H2 style={styles.userPhoneNumber}>{this.props.user.phoneNumber}</H2>
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              onPress={() =>
                Navigation.push(this.props.componentId, {
                  component: {
                    id: NavigationScreens.PARCEL_MANAGER_SCREEN,
                    name: NavigationScreens.PARCEL_MANAGER_SCREEN,
                  },
                })
              }
              style={{justifyContent: 'center', alignItems: 'center'}}>
              <View style={styles.accountActions}>
                <Icon
                  name="th-list"
                  type="FontAwesome"
                  style={{color: Colors.Brand.brandColor}}
                />
              </View>
              <Text style={styles.labelProfileItems}>My items</Text>
            </TouchableOpacity>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <View style={styles.accountActions}>
                <Icon
                  name="shopping-cart"
                  type="Feather"
                  style={{color: Colors.Brand.brandColor}}
                />
              </View>
              <Text style={styles.labelProfileItems}>orders</Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                Navigation.push(this.props.componentId, {
                  component: {
                    id: NavigationScreens.CREATE_PARCEL_SCREEN,
                    name: NavigationScreens.CREATE_PARCEL_SCREEN,
                  },
                })
              }
              style={{justifyContent: 'center', alignItems: 'center'}}>
              <View style={styles.accountActions}>
                <Icon
                  name="md-add-outline"
                  style={{color: Colors.Brand.brandColor}}
                />
              </View>
              <Text style={styles.labelProfileItems}>New Item</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchStateToProps)(Profile);
