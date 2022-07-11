import crashlytics from '@react-native-firebase/crashlytics';
import {
  DEVICE_ID,
  DEVICE_BRAND,
  DEVICE_MODEL,
} from '../deviceInfo';

export function setCrashlyticsUserId(id) {
  try {
    crashlytics().setUserId(id);
    if (__DEV__) {
      console.log(`[ crashlytics ] set userId ( ${id} )`);
    }
  } catch (e) {
    if (__DEV__) {
      console.log('[ crashlytics ] set userId failure', e);
    }
  }
}
export function logError(params) {
  const {
    code,
    type,
    email = null,
    data = null,
  } = params;

  crashlytics().setUserId(email);
  crashlytics().setAttribute('DeviceID', DEVICE_ID);
  crashlytics().setAttribute('Brand', DEVICE_BRAND);
  crashlytics().setAttribute('Model', DEVICE_MODEL);
  crashlytics().setAttribute('Event', type);
  crashlytics().setAttribute('Messages', JSON.stringify(data));

  if (email) {
    crashlytics().recordError({
      name: code.toString(),
      message: `${email} on ${type}`,
    });
  } else {
    crashlytics().recordError({
      name: code.toString(),
      message: type,
    });
  }
}
