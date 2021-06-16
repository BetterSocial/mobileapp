import {
  setAccessToken,
  setRefreshToken,
  setToken,
} from '../../src/data/local/accessToken';
import {
  getMainFeed,
  ShowingAudience,
  createFeedToken,
  createPollPost,
  createPost,
} from '../../src/service/post';
import {verifyUser} from '../../src/service/users';
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
describe('services posts', () => {
  it('testing service ShowingAudience', async () => {
    const onResponse = jest.fn();
    const onError = jest.fn();
    await ShowingAudience('everyone', 'indonesia')
      .then(onResponse)
      .catch(onError)
      .finally(() => {
        expect(onResponse).toHaveBeenCalled();
      });
  });
  it('testing service getMainFeed', async () => {
    const onResponse = jest.fn();
    const onError = jest.fn();
    await getMainFeed()
      .then(onResponse)
      .catch(onError)
      .finally(() => {
        expect(onResponse).toHaveBeenCalled();
      });
  });
  it('testing service createFeedToken', async () => {
    const onResponse = jest.fn();
    const onError = jest.fn();
    createFeedToken()
      .then(onResponse)
      .catch(onError)
      .finally(() => {
        expect(onResponse).toHaveBeenCalled();
      });
  });
  it('testing service createPollPost', async () => {
    const onResponse = jest.fn();
    const onError = jest.fn();
    let data = {
      topics: ['day'],
      message: 'poll 21',
      verb: 'poll',
      feedGroup: 'main_feed',
      privacy: 'public',
      anonimity: false,
      location: 'majalengka',
      duration_feed: '1',
      images_url: null,
      polls: [{text: 'Coba poll'}, {text: 'Coba poll 2'}],
      pollsduration: {
        day: 1,
        hour: 0,
        minute: 0,
      },
      multiplechoice: false,
    };
    await createPollPost(data)
      .then(onResponse)
      .catch(onError)
      .finally(() => {
        expect(onResponse).toHaveBeenCalled();
      });
  });

  it('testing service createPost', async () => {
    const onResponse = jest.fn();
    const onError = jest.fn();
    let data = {
      topics: ['testing', 'jest'],
      message: 'testing',
      verb: 'tweet',
      feedGroup: 'main_feed',
      privacy: 'Public',
      anonimity: true,
      location: 'Everywhere',
      duration_feed: 24,
      images_url: [],
    };
    await createPost(data)
      .then(onResponse)
      .catch(onError)
      .finally(() => {
        expect(onResponse).toHaveBeenCalled();
      });
  });
});
