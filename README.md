# campus-shoping client mobile

## Installing dependecies

```bash
   ## root directory
   yarn
   ## or
   npm install
```

## Runing application

```bash
   ## root directory windows
   react-native run-android
   ## or linux
   react-native run-android && yarn start
```

## Linux Configuration Only

```bash
  ## for gradle to work for build on linux you have to give gradle right to be executed
  cd android
  sudo chmod 755 ./gradlew
```

## Bug fixes

---

## **react-native-paystack**

- Goto path `node_modules/react-native-paystack/android/build.gradlew`

```gradle
// Change pinpad version from 1.0.1 to 1.0.3 to fix build error
implementation 'co.paystack.android.design.widget:pinpad:1.0.3'

```

## **react-native-ui-lib**

- Go to `node_modules/react-native-ui-lib/lib/components/WheelPicker/index.js`

```javascript
// Find the line below. you can find it on line 5
import {Picker} from '@react-native-community/picker'; // remove this line

// At the bottom of the code change Picker to null
export default Constants.isAndroid ? WheelPicker : null;
```
