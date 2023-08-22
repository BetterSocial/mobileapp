import {
  getAccessToken,
  getRefreshToken,
  getUserId,
  setAccessToken,
  setRefreshToken,
  setUserId
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
});
it('Testing set userId', async () => {
  const userId = '6I7SIFD7BPSKZGK0Y6';
  await setUserId(userId);
  expect(await getUserId()).toEqual(userId);
});
