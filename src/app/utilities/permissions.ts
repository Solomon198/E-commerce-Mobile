import {PermissionsAndroid, Platform, Alert} from 'react-native';

async function RequestLocationPermissions() {
  try {
    if (Platform.OS === 'android') {
      let permission = await PermissionsAndroid.request(
        'android.permission.ACCESS_FINE_LOCATION',
      );
      let permission2 = await PermissionsAndroid.request(
        'android.permission.ACCESS_COARSE_LOCATION',
      );

      if (permission === 'granted' && permission2 === 'granted') {
        return true;
        //granted
      } else {
        Alert.alert(
          'Permission !!!!',
          'App needs permission to function correctly',
        );
        return false;
      }
    } else {
      //  requestAuthorization();
    }
  } catch (e) {
    console.log(e);
    return e;
  }
}

export default {
  RequestLocationPermissions,
};
