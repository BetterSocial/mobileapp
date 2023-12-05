import mock from 'react-native-permissions/mock';
import {checkCameraPermission, requestExternalStoragePermission} from '../../src/utils/permission';
import StringConstant from '../../src/utils/string/StringConstant';

jest.mock('react-native-permissions', () => {
  return mock;
});

describe('Util permission should correct', () => {
  beforeAll(() => {
    jest.mock('react-native/Libraries/Utilities/Platform', () => ({
      OS: 'android', // or 'ios'
      select: () => null
    }));
  });
  it('checkCameraPermission granted should run correctly', async () => {
    jest.spyOn(mock, 'check').mockResolvedValue('granted');
    const checkPermission = await checkCameraPermission();
    expect(mock.check).toHaveBeenCalled();
    expect(checkPermission.message).toEqual(StringConstant.cameraPermissionGranted);
  });
  it('checkCameraPermission unavailable should run correctly', async () => {
    jest.spyOn(mock, 'check').mockResolvedValue('unavailable');
    const checkPermission = await checkCameraPermission();
    expect(mock.check).toHaveBeenCalled();
    expect(checkPermission.message).toEqual(StringConstant.cameraPermissionUnavailable);
  });
  it('checkCameraPermission denied should run correctly', async () => {
    jest.spyOn(mock, 'check').mockResolvedValue('denied');
    const checkPermission = await checkCameraPermission();
    expect(mock.check).toHaveBeenCalled();
    expect(checkPermission.message).toEqual(StringConstant.cameraPermissionDenied);
  });

  it('checkCameraPermission default should run correctly', async () => {
    jest.spyOn(mock, 'check').mockResolvedValue('default');
    const checkPermission = await checkCameraPermission();
    expect(mock.check).toHaveBeenCalled();
    expect(checkPermission.message).toEqual('');
  });
});

describe('requestExternalStoragePermission shpuld run correctly', () => {
  beforeAll(() => {
    jest.mock('react-native/Libraries/Utilities/Platform', () => ({
      OS: 'android', // or 'ios'
      select: () => null
    }));
  });
  it('requestExternalStoragePermission granted should run correctly', async () => {
    jest.spyOn(mock, 'requestMultiple').mockResolvedValue({
      'android.permission.READ_EXTERNAL_STORAGE': 'granted',
      'ios.permission.PHOTO_LIBRARY': 'granted',
      'android.permission.READ_MEDIA_IMAGES': 'granted'
    });
    const checkPermission = await requestExternalStoragePermission();
    expect(mock.check).toHaveBeenCalled();
    expect(checkPermission.message).toEqual(StringConstant.cameraPermissionGranted);
  });
  it('requestExternalStoragePermission unavailable should run correctly', async () => {
    jest.spyOn(mock, 'requestMultiple').mockResolvedValue({
      'android.permission.READ_EXTERNAL_STORAGE': 'unavailable',
      'ios.permission.PHOTO_LIBRARY': 'unavailable',
      'android.permission.READ_MEDIA_IMAGES': 'unavailable'
    });
    const checkPermission = await requestExternalStoragePermission();
    expect(mock.check).toHaveBeenCalled();
    expect(checkPermission.message).toEqual(StringConstant.externalStoragePermissionUnavailable);
  });
  it('requestExternalStoragePermission denied should run correctly', async () => {
    jest.spyOn(mock, 'requestMultiple').mockResolvedValue({
      'android.permission.READ_EXTERNAL_STORAGE': 'denied',
      'ios.permission.PHOTO_LIBRARY': 'denied',
      'android.permission.READ_MEDIA_IMAGES': 'denied'
    });
    const checkPermission = await requestExternalStoragePermission();
    expect(mock.check).toHaveBeenCalled();
    expect(checkPermission.message).toEqual(StringConstant.externalStoragePermissionDenied);
  });
});
