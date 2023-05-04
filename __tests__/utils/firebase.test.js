import {cleanup} from '@testing-library/react-native';

import {setMessage} from '../../src/utils/firebase/setMessaging';

const mockedOnTokenRefresh = jest.fn((callback) => callback('newToken'));
const mockedGetToken = jest.fn(() => 'token');

jest.mock('@react-native-firebase/messaging', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    getToken: mockedGetToken,
    onTokenRefresh: mockedOnTokenRefresh
  }))
}));

describe('Firebase utils test should pass', () => {
  afterEach(cleanup);

  const client = {
    addDevice: jest.fn()
  };

  it('should call addDevice with token and firebase', async () => {
    await setMessage(client);
    expect(mockedGetToken).toBeCalledTimes(1);
    expect(client.addDevice).toHaveBeenCalledWith('token', 'firebase');
  });

  it('should call onRefreshToken when set message is called', async () => {
    await setMessage(client);
    expect(mockedOnTokenRefresh).toHaveBeenCalled();
  });

  it('should call addDevice with newToken and firebase', async () => {
    await setMessage(client);
    mockedOnTokenRefresh(client.addDevice);
    expect(client.addDevice).toHaveBeenCalledWith('newToken', 'firebase');
  });
});
