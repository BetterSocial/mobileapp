import {PERMISSIONS, RESULTS, check, request, requestMultiple} from 'react-native-permissions';
import {Platform} from 'react-native';

import StringConstant from '../string/StringConstant';

export const checkCameraPermission = async () => {
  const result = await check(
    Platform.OS === 'android' ? PERMISSIONS.ANDROID.CAMERA : PERMISSIONS.IOS.CAMERA
  );
  console.log({result}, 'lapak');
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

const androidPermission = () => {
  if (Platform.Version < 33) {
    return [PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE, PERMISSIONS.ANDROID.CAMERA];
  }
  return [PERMISSIONS.ANDROID.READ_MEDIA_IMAGES];
};

export const requestExternalStoragePermission = async () => {
  try {
    const requestResult = await requestMultiple(
      Platform.OS === 'android' ? androidPermission() : [PERMISSIONS.IOS.PHOTO_LIBRARY]
    );
    if (
      requestResult['android.permission.READ_EXTERNAL_STORAGE'] === 'granted' ||
      requestResult['ios.permission.PHOTO_LIBRARY'] === 'granted' ||
      requestResult['android.permission.READ_MEDIA_IMAGES'] === 'granted'
    ) {
      return {
        message: StringConstant.cameraPermissionGranted,
        success: true
      };
    }
    return {
      message: StringConstant.externalStoragePermissionDenied,
      success: false
    };
  } catch (err) {
    return {
      success: false,
      message: err
    };
  }
};
