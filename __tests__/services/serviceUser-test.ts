import {
  getAccessToken,
  setAccessToken,
  setRefreshToken,
  setToken,
} from '../../src/data/local/accessToken';
import {
  verifyUser,
  verifyUsername,
  verifyTokenGetstream,
  registerUser,
} from '../../src/service/users';
// 6I7SIFD7BPSKZGK0Y6DF => id human id
beforeAll(async () => {
  await verifyUser('6I7SIFD7BPSKZGK0Y6DF')
    .then((res) => {
      setAccessToken(res.token);
      setToken(res.token);
      setRefreshToken(res.refresh_token);
      return true;
    })
    .catch((err) => {
      console.log('error ', err);
      return true;
    });
});
jest.setTimeout(10000);
describe('service-user', () => {
  it('test verify user Id', async () => {
    const onResponse = jest.fn();
    const onError = jest.fn();
    await verifyUser('6I7SIFD7BPSKZGK0Y6DF')
      .then(onResponse)
      .catch(onError)
      .finally(() => {
        expect(onResponse).toHaveBeenCalled();

        expect(onResponse.mock.calls[0][0]).toHaveProperty('code', 200);
        expect(onResponse.mock.calls[0][0]).toHaveProperty('data', true);
        expect(onResponse.mock.calls[0][0]).toHaveProperty('token');
        expect(onResponse.mock.calls[0][0]).toHaveProperty('refresh_token');
        expect(onResponse.mock.calls[0][0]).not.toBeNull();
      });
  });
  it('test username verification is available', async () => {
    const onResponse = jest.fn();
    const onError = jest.fn();
    await verifyUsername('testUser')
      .then(onResponse)
      .catch(onError)
      .finally(() => {
        expect(onResponse).toHaveBeenCalled();
        expect(onResponse.mock.calls[0][0]).not.toBeNull();
        expect(onResponse.mock.calls[0][0]).toHaveProperty('code', 200);
        expect(onResponse.mock.calls[0][0]).toHaveProperty('data', 0);
        expect(onResponse.mock.calls[0][0]).toHaveProperty(
          'message',
          'success',
        );
      });
  });
  it('test username verification is not available', async () => {
    const onResponse = jest.fn();
    const onError = jest.fn();
    await verifyUsername('eka')
      .then(onResponse)
      .catch(onError)
      .finally(() => {
        expect(onResponse).toHaveBeenCalled();

        expect(onResponse.mock.calls[0][0]).not.toBeNull();
        expect(onResponse.mock.calls[0][0]).toHaveProperty('code', 200);
        expect(onResponse.mock.calls[0][0]).toHaveProperty('data', 1);
        expect(onResponse.mock.calls[0][0]).toHaveProperty(
          'message',
          'success',
        );
      });
  });
  it('testing verifyTokenGetstream', async () => {
    expect(await verifyTokenGetstream()).toStrictEqual({
      code: 200,
      data: true,
      message: '',
    });
  });
  it('testing register', async () => {
    const data = {
      users: {
        username: 'testing',
        human_id: '6I7SIFD7BPSKZGK0Y6DF',
        country_code: 'ID',
        profile_pic_path: '',
        status: 'A',
      },
      local_community: ['21'],
      topics: ['1', '2', '3'],
      follows: ['f721d98d-4704-45b0-aecf-2d30547319e5'],
      follow_source: 'onboarding',
    };
    const onResponse = jest.fn();
    const onError = jest.fn();
    await registerUser(data)
      .then(onResponse)
      .catch(onError)
      .finally(() => {
        expect(onResponse).toHaveBeenCalled();
      });
  });
});
