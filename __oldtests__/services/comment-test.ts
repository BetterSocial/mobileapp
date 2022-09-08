import {setAccessToken, setRefreshToken, setToken} from '../../src/utils/token';
import {
  createCommentParent,
  createChildComment,
} from '../../src/service/comment';
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
describe('testing service comment', () => {
  let parentID = 'f57e3b14-c9db-4ed9-a15d-30a8b7e54854';
  let reactionID = '6542f596-5b07-442d-8e76-a46ed3fba0e3';
  it('testing endpoint createCommentParent', async () => {
    const onResponse = jest.fn();
    const onError = jest.fn();
    await createCommentParent('testing comment', parentID)
      .then(onResponse)
      .catch(onError)
      .finally(() => {
        expect(onResponse).toHaveBeenCalled();
        // console.log(onResponse.mock.calls);
      });
  });
  it('testing endpoint createChildComment', async () => {
    const onResponse = jest.fn();
    const onError = jest.fn();
    await createChildComment('child testing comment', reactionID)
      .then(onResponse)
      .catch(onError)
      .finally(() => {
        expect(onResponse).toHaveBeenCalled();
        // console.log(onResponse.mock.calls);
      });
  });
});
