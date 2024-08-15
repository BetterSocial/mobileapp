import {cleanup} from '@testing-library/react-hooks';

import ShareUtils from '../../src/utils/share';

const mockedShare = jest.fn(() => {
  Promise.resolve({
    action: 'sharedAction',
    activityType: 'activityType'
  });
});

const mockedAlert = jest.fn();
const mockedAnalytics = jest.fn();

jest.mock('react-native/Libraries/Share/Share', () => ({
  share: mockedShare
}));

jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: mockedAlert
}));

jest.mock('react-native-config', () => ({
  POST_SHARE_URL: 'https://www.google.com'
}));

jest.mock('@react-native-firebase/analytics', () => {
  return () => ({
    logEvent: mockedAnalytics
  });
});

jest.mock('@react-native-clipboard/clipboard', () => ({
  setString: jest.fn()
}));

describe('Share utils test should pass', () => {
  afterEach(cleanup);

  it('share domain should pass', async () => {
    await ShareUtils.shareDomain({
      content: {
        news_url: 'https://www.google.com'
      }
    });
    expect(mockedShare).toHaveBeenCalledWith({
      message: 'https://www.google.com'
    });
  });

  it('share news should pass', async () => {
    await ShareUtils.shareNews({
      content: {
        url: 'https://www.google.com'
      }
    });

    expect(mockedShare).toHaveBeenCalledWith({
      message: 'https://www.google.com'
    });
  });

  it('should call analytics and build share when share post in topic', async () => {
    await ShareUtils.sharePostInTopic(
      {
        id: '1'
      },
      'analyticsLogEvent',
      'analyticsId'
    );

    expect(mockedShare).toHaveBeenCalledWith({
      message: 'https://www.google.com/post/1'
    });
  });

  it('should call analytics and build share when share feeds', async () => {
    await ShareUtils.shareFeeds(
      {
        id: '10'
      },
      'analyticsFeedLogEvent',
      'analyticsFeedId'
    );

    expect(mockedAnalytics).toHaveBeenCalledWith('analyticsFeedLogEvent', {
      id: 'analyticsFeedId'
    });

    expect(mockedShare).toHaveBeenCalledWith({
      message: 'https://www.google.com/post/10'
    });
  });

  it('should call analytics and build share when share post in profile', async () => {
    await ShareUtils.sharePostInProfile(
      {
        id: '100'
      },
      'analyticsFeedInProfileLogEvent',
      'analyticsFeedInProfileId'
    );

    expect(mockedAnalytics).toHaveBeenCalledWith('analyticsFeedInProfileLogEvent', {
      id: 'analyticsFeedInProfileId'
    });

    expect(mockedShare).toHaveBeenCalledWith({
      message: 'https://www.google.com/post/100'
    });
  });

  it('should call share community', async () => {
    ShareUtils.shareCommunity('topicname');
    expect(mockedShare).toHaveBeenCalledWith({
      message: 'https://www.google.com/c/topicname'
    });
  });

  it('should call share user link', async () => {
    await ShareUtils.shareUserLink('https://www.google.com');
    expect(mockedShare).toHaveBeenCalledWith({
      message: 'https://www.google.com'
    });
  });
});
