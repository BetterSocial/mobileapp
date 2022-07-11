import deviceInfo from 'react-native-device-info';

export const DEVICE_ID = deviceInfo.getDeviceId();
export const DEVICE_BRAND = deviceInfo.getBrand();
export const DEVICE_MODEL = deviceInfo.getModel();
export const DEVICE_NAME = deviceInfo.getDeviceName();
export const DEVICE_BUILD_NUMBER = deviceInfo.getBuildNumber();
