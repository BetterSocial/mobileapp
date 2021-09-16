import {PermissionsAndroid} from 'react-native';
import StringConstant from '../string/StringConstant';

export const requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the camera');
      return {
        success: true,
        message: StringConstant.cameraPermissionGranted,
      };
    } else {
      console.log('Camera permission denied');
      return {
        success: false,
        message: StringConstant.cameraPermissionDenied,
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
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the storage');
      return {
        success: true,
        message: StringConstant.externalStoragePermissionGranted,
      };
    } else {
      console.log('storage permission denied');
      return {
        success: false,
        message: StringConstant.externalStoragePermissionDenied,
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
