import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  setAccessToken,
  getAccessToken,
  setRefreshToken,
  getRefreshToken,
  getUserId,
  setUserId,
  setToken,
  setAnonymousToken,
  getToken,
  removeLocalStorege
} from './index';

describe('testing function related to the token', () => {
  it('Test Set Token & Get Token', async () => {
    await setAccessToken('testToken');
    expect(await getAccessToken()).toEqual('testToken');
  });
  it('Test Refresh Token', async () => {
    await setRefreshToken({id: '1234'});
    expect(await getRefreshToken()).toEqual('{"id":"1234"}');
  });

  it('setToken should run correctly', async () => {
    const spyStorage = jest.spyOn(AsyncStorage, 'setItem');
    await setToken('123456');
    expect(spyStorage).toHaveBeenCalled();
  });
  it('setAnonymousToken should run correctly', async () => {
    const spyStorage = jest.spyOn(AsyncStorage, 'setItem');
    await setAnonymousToken('123456');
    expect(spyStorage).toHaveBeenCalled();
  });
  it('getToken should run correctly', async () => {
    const spyStorage = jest.spyOn(AsyncStorage, 'getItem').mockResolvedValue('6I7SIFD7BPSKZGK0Y6');
    const store = await getToken();
    expect(spyStorage).toHaveBeenCalled();
    expect(store).toEqual('6I7SIFD7BPSKZGK0Y6');
  });
  it('setUserId should run correctly', async () => {
    const spyStorage = jest.spyOn(AsyncStorage, 'setItem');
    await setUserId('123456');
    expect(spyStorage).toHaveBeenCalled();
  });
  it('getUserIdshould run correctly', async () => {
    const spyStorage = jest.spyOn(AsyncStorage, 'getItem').mockResolvedValue('6I7SIFD7BPSKZGK0Y6');
    const store = await getUserId();
    expect(spyStorage).toHaveBeenCalled();
    expect(store).toEqual('6I7SIFD7BPSKZGK0Y6');
  });

  it('removeLocalStorage run correctly', async () => {
    const spyStorage = jest.spyOn(AsyncStorage, 'removeItem');
    await removeLocalStorege();
    expect(spyStorage).toHaveBeenCalled();
  });
});

it('Testing set userId', async () => {
  const userId = '6I7SIFD7BPSKZGK0Y6';
  await setUserId(userId);
  expect(await getUserId()).toEqual(userId);
});
