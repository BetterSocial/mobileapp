import {blockDomain, blockUser} from '../../src/service/blocking';
describe('services blocking', () => {
  it('testing service blockDomain', async () => {
    const onResponse = jest.fn();
    const onError = jest.fn();
    let data = {
      domainId: '288d5679-6c68-41ec-be83-7f15a4e82d3d',
      reason: ['It’s spreading fake news', 'It’s phishing'],
      message: 'Violence/threats against humans or animals',
      source: 'testing',
    };
    await blockDomain(data)
      .then(onResponse)
      .catch(onError)
      .finally(() => {
        expect(onResponse).toHaveBeenCalled();
      });
  });
  it('testing service blockUser', async () => {
    const onResponse = jest.fn();
    const onError = jest.fn();
    let data = {
      userId: '288d5679-6c68-41ec-be83-7f15a4e82d3d',
      postId: '288d5679-6c68-41ec-be83-7f15a4e82d3d',
      reason: ['It’s spreading fake news', 'It’s phishing'],
      message: 'Violence/threats against humans or animals',
      source: 'testing',
    };
    await blockUser(data)
      .then(onResponse)
      .catch(onError)
      .finally(() => {
        expect(onResponse).toHaveBeenCalled();
      });
  });
});
