import {OneSignal} from 'react-native-onesignal';

import OneSignalUtil from '../../../src/service/onesignal';

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
  getSubscribeableTopic: jest.fn(() => mockSubscribeableTopicResponse)
}));

describe('TESTING OneSignalUtil', () => {
  it('TEST should call add tag and remove tag when calling resubscribe', async () => {
    await OneSignalUtil.rebuildAndSubscribeTags();
    expect(OneSignal.User.removeTag).toHaveBeenCalledTimes(3);
    expect(OneSignal.User.addTag).toHaveBeenCalledTimes(2);
  });
});
