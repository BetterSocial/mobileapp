import {
  setAccessToken,
  getAccessToken,
  setRefreshToken,
  getRefreshToken,
  getUserId,
  setUserId,
  setToken,
  getToken,
  setAnonymousToken,
  getAnonymousToken,
  removeLocalStorege,
  removeAccessToken,
} from '../../src/utils/token';
describe('testing function related to the token', () => {
  it('Test Set Token & Get Token', async () => {
    await setAccessToken('testToken');
    expect(await getAccessToken()).toEqual('testToken');
  });
  it('Test Refresh Token', async () => {
    await setRefreshToken({id: '1234'});
    expect(await getRefreshToken()).toEqual('{"id":"1234"}');
  });

  it('test setToken should run correctly ', async () => {
    await setToken('testToken');
    expect(await getToken()).toEqual('testToken');
  });

  it('setAnonymousToken should run correctly', async () => {
    await setAnonymousToken('tokenAnonym');
    expect(await getAnonymousToken()).toEqual('tokenAnonym');
  });

  it('setUserUd should run correctly', async () => {
    await setAnonymousToken('tokenAnonym');
    expect(await getAnonymousToken()).toEqual('tokenAnonym');
  });

  it('removeLocalStorage should run correctly', async () => {
    await removeLocalStorege('tkn-getstream');
    expect(await getToken()).toEqual(null);
  });
  it('removeAccessToken should run correctly', async () => {
    await removeAccessToken();
    expect(await getUserId()).toEqual(null);
  });
});
it('Testing set userId', async () => {
  const userId = '6I7SIFD7BPSKZGK0Y6';
  await setUserId(userId);
  expect(await getUserId()).toEqual(userId);
});
