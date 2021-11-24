import {PermissionsAndroid} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import ImagePicker from 'react-native-image-crop-picker';

async function requestNotificationPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

export async function requestPersmission() {
  try {
    const writePermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
    const readPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    );

    if (writePermission == 'granted' && readPermission == 'granted') {
      return 'Success';
    } else {
      throw new Error('Please accept all permission');
    }
  } catch (e) {
    return e;
  }
}

export function matchStatus(status: number) {
  if (status === 400 || status === 500 || status === 409 || status === 403) {
    return true;
  } else {
    return false;
  }
}

export function getDefaultProfilePicture(gender: string) {
  let male = require('../../../assets/media/images/male.jpg');
  let female = require('../../../assets/media/images/female.png');

  if (gender === 'male') {
    return male;
  } else {
    return female;
  }
}

async function getImageFromGallery() {
  await requestPersmission();
  const takePicture = await ImagePicker.openPicker({
    mediaType: 'photo',
  });
  return takePicture.path;
}

export default {
  matchStatus,
  getDefaultProfilePicture,
  requestPersmission,
  requestNotificationPermission,
  getImageFromGallery,
};
