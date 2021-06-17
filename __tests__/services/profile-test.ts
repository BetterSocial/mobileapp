import {
  setAccessToken,
  setRefreshToken,
  setToken,
} from '../../src/data/local/accessToken';
import {
  getMyProfile,
  getPost,
  getOtherProfile,
  changeRealName,
  getFollowing,
  getProfileByUsername,
  setUnFollow,
  setFollow,
  updateImageProfile,
  removeImageProfile,
  updateBioProfile,
} from '../../src/service/profile';
import {verifyUser} from '../../src/service/users';
let userId = 'c8c39e52-5484-465c-b635-3c46384b6f2e';
let otherId = '88353551-b9bd-4cf5-a89e-ce6197b880c0';
beforeAll(async () => {
  await verifyUser('6I7SIFD7BPSKZGK0Y6DF')
    .then(async (res) => {
      await setAccessToken(res.token);
      await setToken(res.token);
      await setRefreshToken(res.refresh_token);
      return true;
    })
    .catch((err) => {
      console.log('error Login');
      return true;
    });
});
jest.setTimeout(10000);
describe('testing endpoit user profile', () => {
  it('testing get my profile', async () => {
    const onResponse = jest.fn();
    const onError = jest.fn();
    await getMyProfile(userId)
      .then(onResponse)
      .catch(onError)
      .finally(() => {
        expect(onResponse).toHaveBeenCalled();
        expect(onResponse.mock.calls[0][0]).not.toBeNull();
        expect(onResponse.mock.calls[0][0]).toHaveProperty('status', 'success');
        expect(onResponse.mock.calls[0][0]).toHaveProperty('code', 200);
        expect(onResponse.mock.calls[0][0]).toHaveProperty('data');
        expect(onResponse.mock.calls[0][0].data).not.toBeNull();
      });
  });

  it('testing endpoint getpost', async () => {
    const onResponse = jest.fn();
    const onError = jest.fn();
    await getPost(userId)
      .then(onResponse)
      .catch(onError)
      .finally(() => {
        expect(onResponse).toHaveBeenCalled();
        expect(onResponse.mock.calls[0][0]).not.toBeNull();
        expect(onResponse.mock.calls[0][0]).toHaveProperty('status', 'success');
        expect(onResponse.mock.calls[0][0]).toHaveProperty('code', 200);
        expect(onResponse.mock.calls[0][0]).toHaveProperty('data');
        expect(onResponse.mock.calls[0][0].data).not.toBeNull();
      });
  });
  it('testing endpoint getOtherProfile', async () => {
    const onResponse = jest.fn();
    const onError = jest.fn();
    await getOtherProfile(userId, otherId)
      .then(onResponse)
      .catch(onError)
      .finally(() => {
        expect(onResponse).toHaveBeenCalled();
        expect(onResponse.mock.calls[0][0]).not.toBeNull();
        expect(onResponse.mock.calls[0][0]).toHaveProperty('status', 'success');
        expect(onResponse.mock.calls[0][0]).toHaveProperty('code', 200);
        expect(onResponse.mock.calls[0][0]).toHaveProperty('data');
        expect(onResponse.mock.calls[0][0].data).not.toBeNull();
      });
  });
  it('testing endpoint changeRealName', async () => {
    const onResponse = jest.fn();
    const onError = jest.fn();
    await changeRealName(userId, 'eka1')
      .then(onResponse)
      .catch(onError)
      .finally(() => {
        expect(onResponse).toHaveBeenCalled();
        expect(onResponse.mock.calls[0][0]).not.toBeNull();
        expect(onResponse.mock.calls[0][0]).toHaveProperty('status', 'success');
        expect(onResponse.mock.calls[0][0]).toHaveProperty('code', 200);
        expect(onResponse.mock.calls[0][0]).toHaveProperty('data');
        expect(onResponse.mock.calls[0][0].data).not.toBeNull();
      });
  });
  it('testing endpoint getFollowing', async () => {
    const onResponse = jest.fn();
    const onError = jest.fn();
    await getFollowing(userId)
      .then(onResponse)
      .catch(onError)
      .finally(() => {
        expect(onResponse).toHaveBeenCalled();
        expect(onResponse.mock.calls[0][0]).not.toBeNull();
        expect(onResponse.mock.calls[0][0]).toHaveProperty('status', 'success');
        expect(onResponse.mock.calls[0][0]).toHaveProperty('code', 200);
        expect(onResponse.mock.calls[0][0]).toHaveProperty('data');
        expect(onResponse.mock.calls[0][0].data).not.toBeNull();
      });
  });
  it('testing endpoint getProfileByUsername', async () => {
    const onResponse = jest.fn();
    const onError = jest.fn();
    await getProfileByUsername('sample1')
      .then(onResponse)
      .catch(onError)
      .finally(() => {
        expect(onResponse).toHaveBeenCalled();
        expect(onResponse.mock.calls[0][0]).not.toBeNull();
        expect(onResponse.mock.calls[0][0]).toHaveProperty(
          'message',
          'Success',
        );
        expect(onResponse.mock.calls[0][0]).toHaveProperty('code', 200);
        expect(onResponse.mock.calls[0][0]).toHaveProperty('data');
        expect(onResponse.mock.calls[0][0].data).not.toBeNull();
      });
  });
  it('testing endpoint setFollow', async () => {
    let data = {
      user_id_follower: userId,
      user_id_followed: otherId,
      follow_source: 'other-profile-test',
    };
    const onResponse = jest.fn();
    const onError = jest.fn();
    await setFollow(data)
      .then(onResponse)
      .catch(onError)
      .finally(() => {
        expect(onResponse).toHaveBeenCalled();
        expect(onResponse.mock.calls[0][0]).not.toBeNull();
        expect(onResponse.mock.calls[0][0]).toHaveProperty('status', 'success');
        expect(onResponse.mock.calls[0][0]).toHaveProperty('code', 200);
        expect(onResponse.mock.calls[0][0]).toHaveProperty('data');
        expect(onResponse.mock.calls[0][0].data).not.toBeNull();
      });
  });
  it('testing endpoint setUnFollow', async () => {
    let data = {
      user_id_follower: userId,
      user_id_followed: otherId,
      follow_source: 'other-profile-test',
    };
    const onResponse = jest.fn();
    const onError = jest.fn();
    await setUnFollow(data)
      .then(onResponse)
      .catch(onError)
      .finally(() => {
        expect(onResponse).toHaveBeenCalled();
      });
  });

  it('testing endpoint updateImageProfile', async () => {
    const onResponse = jest.fn();
    const onError = jest.fn();
    let data = {
      profile_pic_path:
        'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P//PwAGBAL/VJiKjgAAAABJRU5ErkJggg==',
    };
    await updateImageProfile(userId, data)
      .then(onResponse)
      .catch(onError)
      .finally(() => {
        // console.log(onResponse.mock.calls);
        expect(onResponse).toHaveBeenCalled();
      });
  });
  it('testing endpoint removeImageProfile', async () => {
    const onResponse = jest.fn();
    const onError = jest.fn();
    await removeImageProfile(userId)
      .then(onResponse)
      .catch(onError)
      .finally(() => {
        expect(onResponse).toHaveBeenCalled();
        expect(onResponse.mock.calls[0][0]).not.toBeNull();
        expect(onResponse.mock.calls[0][0]).toHaveProperty('status', 'success');
        expect(onResponse.mock.calls[0][0]).toHaveProperty('code', 200);
        expect(onResponse.mock.calls[0][0]).toHaveProperty('data');
        expect(onResponse.mock.calls[0][0].data).not.toBeNull();
      });
  });
  it('testing endpoint add bio', async () => {
    let data = {
      bio: 'i learn',
    };
    const onResponse = jest.fn();
    const onError = jest.fn();
    await updateBioProfile(userId, data)
      .then(onResponse)
      .catch(onError)
      .finally(() => {
        expect(onResponse).toHaveBeenCalled();
        expect(onResponse.mock.calls[0][0]).not.toBeNull();
        expect(onResponse.mock.calls[0][0]).toHaveProperty('status', 'success');
        expect(onResponse.mock.calls[0][0]).toHaveProperty('code', 200);
        expect(onResponse.mock.calls[0][0]).toHaveProperty('data');
        expect(onResponse.mock.calls[0][0].data).not.toBeNull();
      });
  });
});
