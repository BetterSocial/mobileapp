import {downVote, upVote} from '../../src/service/vote';
describe('services votes', () => {
  it('testing service downVote', async () => {
    let id = 'f57e3b14-c9db-4ed9-a15d-30a8b7e54854';
    const onResponse = jest.fn();
    const onError = jest.fn();
    await downVote({activity_id: id})
      .then(onResponse)
      .catch(onError)
      .finally(() => {
        expect(onResponse).toHaveBeenCalled();
      });
  });
  it('testing service upVote', async () => {
    let id = 'f57e3b14-c9db-4ed9-a15d-30a8b7e54854';
    const onResponse = jest.fn();
    const onError = jest.fn();
    await upVote({activity_id: id})
      .then(onResponse)
      .catch(onError)
      .finally(() => {
        expect(onResponse).toHaveBeenCalled();
      });
  });
});
