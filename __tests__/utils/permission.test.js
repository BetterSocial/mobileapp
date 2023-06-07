import mock from 'react-native-permissions/mock';
import {
  checkCameraPermission,
  requestExternalStoragePermission,
  requestCameraPermission
} from '../../src/utils/permission';
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
    jest.spyOn(mock, 'check').mockResolvedValue('granted');
    const checkPermission = await requestExternalStoragePermission();
    expect(mock.check).toHaveBeenCalled();
    expect(checkPermission.message).toEqual(StringConstant.cameraPermissionGranted);
  });
  it('requestExternalStoragePermission unavailable should run correctly', async () => {
    jest.spyOn(mock, 'check').mockResolvedValue('unavailable');
    const checkPermission = await requestExternalStoragePermission();
    expect(mock.check).toHaveBeenCalled();
    expect(checkPermission.message).toEqual(StringConstant.cameraPermissionUnavailable);
  });
  it('requestExternalStoragePermission denied should run correctly', async () => {
    jest.spyOn(mock, 'check').mockResolvedValue('denied');
    const checkPermission = await requestExternalStoragePermission();
    expect(mock.check).toHaveBeenCalled();
    expect(checkPermission.message).toEqual(StringConstant.cameraPermissionGranted);
  });
  it('requestExternalStoragePermission default should run correctly', async () => {
    jest.spyOn(mock, 'check').mockResolvedValue('default');
    const checkPermission = await requestExternalStoragePermission();
    expect(mock.check).toHaveBeenCalled();
    expect(checkPermission.message).toEqual('');
  });
  it('requestExternalStoragePermission denied should run correctly', async () => {
    jest.spyOn(mock, 'check').mockResolvedValue('denied');
    jest.spyOn(mock, 'request').mockResolvedValue('denied');
    const checkPermission = await requestExternalStoragePermission();
    expect(mock.check).toHaveBeenCalled();
    expect(mock.request).toHaveBeenCalled();
    expect(checkPermission.message).toEqual(StringConstant.cameraPermissionDenied);
  });
});

describe('request camera permission should run correctly', () => {
  it('request denied should run correctly', async () => {
    jest.spyOn(mock, 'request').mockResolvedValue('denied');
    const checkPermission = await requestCameraPermission();
    expect(mock.request).toHaveBeenCalled();
    expect(checkPermission.message).toEqual(StringConstant.cameraPermissionDenied);
  });

  it('request granted should run correctly', async () => {
    jest.spyOn(mock, 'request').mockResolvedValue('granted');
    const checkPermission = await requestCameraPermission();
    expect(mock.request).toHaveBeenCalled();
    expect(checkPermission.message).toEqual('');
  });
});
