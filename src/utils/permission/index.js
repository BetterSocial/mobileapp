import {PermissionsAndroid, Platform} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import StringConstant from '../string/StringConstant';

// export const requestCameraPermission = async () => {
//   try {
//     const granted = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.CAMERA,
//     );
//     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//       console.log('You can use the camera');
//       return {
//         success: true,
//         message: StringConstant.cameraPermissionGranted,
//       };
//     } else {
//       console.log('Camera permission denied');
//       return {
//         success: false,
//         message: StringConstant.cameraPermissionDenied,
//       };
//     }
//   } catch (err) {
//     console.warn(err);
//     return {
//       success: false,
//       message: err,
//     };
//   }
// };

// export const requestExternalStoragePermission = async () => {
//   try {
//     const granted = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//     );
//     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//       console.log('You can use the storage');
//       return {
//         success: true,
//         message: StringConstant.externalStoragePermissionGranted,
//       };
//     } else {
//       console.log('storage permission denied');
//       return {
//         success: false,
//         message: StringConstant.externalStoragePermissionDenied,
//       };
//     }
//   } catch (err) {
//     console.warn(err);
//     return {
//       success: false,
//       message: err,
//     };
//   }
// };

export const requestCameraPermission = async () => {
  try {
    let result = await check(
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.CAMERA
        : PERMISSIONS.IOS.CAMERA,
    );
    let message = '';
    let success = false;
    switch (result) {
      case RESULTS.UNAVAILABLE:
        message = StringConstant.cameraPermissionUnavailable;
        success = false;
        break;

      case RESULTS.BLOCKED:
      case RESULTS.DENIED:
        message = StringConstant.cameraPermissionDenied;
        success = false;
        break;

      case RESULTS.GRANTED:
        message = StringConstant.cameraPermissionGranted;
        success = true;
        break;

      default:
        break;
    }

    if (result !== RESULTS.DENIED) {
      return {
        message,
        success,
      };
    }

    let requestResult = await request(
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.CAMERA
        : PERMISSIONS.IOS.CAMERA,
    );
    if (requestResult === RESULTS.GRANTED) {
      return {
        message: StringConstant.cameraPermissionGranted,
        success: true,
      };
    } else {
      return {
        message: StringConstant.cameraPermissionDenied,
        success: false,
      };
    }
  } catch (err) {
    console.warn(err);
    return {
      success: false,
      message: err,
    };
  }
};

export const requestExternalStoragePermission = async () => {
  try {
    let result = await check(
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
        : PERMISSIONS.IOS.PHOTO_LIBRARY,
    );
    let message = '';
    let success = false;
    switch (result) {
      case RESULTS.UNAVAILABLE:
        message = StringConstant.cameraPermissionUnavailable;
        success = false;
        break;

      case RESULTS.BLOCKED:
      case RESULTS.DENIED:
        message = StringConstant.cameraPermissionDenied;
        success = false;
        break;

      case RESULTS.GRANTED:
        message = StringConstant.cameraPermissionGranted;
        success = true;
        break;

      default:
        break;
    }

    if (result !== RESULTS.DENIED) {
      return {
        message,
        success,
      };
    }

    let requestResult = await request(
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
        : PERMISSIONS.IOS.PHOTO_LIBRARY,
    );
    if (requestResult === RESULTS.GRANTED) {
      return {
        message: StringConstant.cameraPermissionGranted,
        success: true,
      };
    } else {
      return {
        message: StringConstant.cameraPermissionDenied,
        success: false,
      };
    }
  } catch (err) {
    console.warn(err);
    return {
      success: false,
      message: err,
    };
  }
};
