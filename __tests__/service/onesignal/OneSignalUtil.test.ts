import {OneSignal} from 'react-native-onesignal';

import OneSignalUtil from '../../../src/service/onesignal';
import {getSubscribeableTopic} from '../../../src/service/topics';

const mockSubscribeableTopicResponse = {
  code: 200,
  data: {
    topics: [{name: 'android'}, {name: 'apple'}],
    history: [{name: 'android'}, {name: 'apple'}, {name: 'women'}]
  },
  message: 'Success get topic user',
  status: 'success'
};

jest.mock('../../../src/service/topics', () => ({
  getSubscribeableTopic: jest.fn()
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('TESTING OneSignalUtil', () => {
  it(
    'TEST should call add tag and remove tag when calling resubscribe',
    async () => {
      // Setup
      getSubscribeableTopic.mockImplementationOnce(() => mockSubscribeableTopicResponse);

      // Execution
      await OneSignalUtil.rebuildAndSubscribeTags();

      // Assertion
      expect(OneSignal.User.removeTag).toHaveBeenCalledTimes(3);
      expect(OneSignal.User.addTag).toHaveBeenCalledTimes(2);
    },
    10 * 1000
  );

  it('TEST should call remove tag when calling removeAllSubscribedTags', async () => {
    // Setup
    getSubscribeableTopic.mockImplementationOnce(() => mockSubscribeableTopicResponse);

    // Execution
    await OneSignalUtil.removeAllSubscribedTags();

    // Assertion
    expect(OneSignal.User.removeTag).toHaveBeenCalledTimes(3);
  });

  it('TEST should catch error', async () => {
    // Setup
    getSubscribeableTopic.mockImplementationOnce(() => {
      throw new Error('Mock Error');
    });

    const consoleSpy = jest.spyOn(console, 'log');

    // Execution
    await OneSignalUtil.rebuildAndSubscribeTags();

    // Assertion
    expect(consoleSpy).toHaveBeenCalledWith('error rebuilding and subscribing tags ', 'Mock Error');
  });
});
