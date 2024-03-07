import {PERMISSIONS, RESULTS, check, request} from 'react-native-permissions';
import {Platform} from 'react-native';

import StringConstant from '../string/StringConstant';

export const checkCameraPermission = async () => {
  const result = await check(
    Platform.OS === 'android' ? PERMISSIONS.ANDROID.CAMERA : PERMISSIONS.IOS.CAMERA
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
  return {
    success,
    message,
    result
  };
};

export const requestCameraPermission = async () => {
  try {
    const {success, message, result} = await checkCameraPermission();
    if (result === RESULTS.UNAVAILABLE || result === RESULTS.DENIED) {
      const resultPermission = await request(
        Platform.OS === 'android' ? PERMISSIONS.ANDROID.CAMERA : PERMISSIONS.IOS.CAMERA
      );
      if (resultPermission === RESULTS.GRANTED) {
        return {
          success: true,
          message: '',
          result: resultPermission
        };
      }

      return {
        success: false,
        message: StringConstant.cameraPermissionDenied,
        result: resultPermission
      };
    }

    return {
      success,
      message,
      result
    };
  } catch (err) {
    return {
      success: false,
      message: err
    };
  }
};

export const requestExternalStoragePermission = async () => {
  try {
    const result = await check(
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
        : PERMISSIONS.IOS.PHOTO_LIBRARY
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
      case RESULTS.LIMITED:
        message = StringConstant.cameraPermissionGranted;
        success = true;
        break;

      default:
        break;
    }

    if (result !== RESULTS.DENIED) {
      return {
        message,
        success
      };
    }

    const requestResult = await request(
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
        : PERMISSIONS.IOS.PHOTO_LIBRARY
    );
    if (requestResult === RESULTS.GRANTED || requestResult === RESULTS.LIMITED) {
      return {
        message: StringConstant.cameraPermissionGranted,
        success: true
      };
    }
    return {
      message: StringConstant.cameraPermissionDenied,
      success: false
    };
  } catch (err) {
    console.warn(err);
    return {
      success: false,
      message: err
    };
  }
};
