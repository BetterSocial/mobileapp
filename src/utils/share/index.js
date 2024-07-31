import Clipboard from '@react-native-clipboard/clipboard';
// import dynamicLinks from '@react-native-firebase/dynamic-links';
import config from 'react-native-config';
import {Alert, Share} from 'react-native';

import AnalyticsEventTracking, {
  BetterSocialEventTracking
} from '../../libraries/analytics/analyticsEventTracking';
import {Analytics} from '../../libraries/analytics/firebaseAnalytics';

const buildShare = async (message) => {
  try {
    const result = await Share.share({
      message
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    Alert.alert(error.message);
  }
};

const shareDomain = async (item) => {
  await buildShare(`${item?.content?.news_url}`);
};

const shareNews = async (item) => {
  await buildShare(`${item?.content?.url}`);
};

const sharePostInTopic = async (item) => {
  AnalyticsEventTracking.eventTrack(
    BetterSocialEventTracking.FEED_COMMUNITY_PAGE_SHARE_BUTTON_CLICKED
  );
  await buildShare(`${config.POST_SHARE_URL}/post/${item?.id}`);
};

const shareCommunity = (topicname) => {
  buildShare(`${config.POST_SHARE_URL}/c/${topicname}`);
};

const sharePostInProfile = async (item, analyticsLogEvent, analyticsId) => {
  Analytics.logEvent(analyticsLogEvent, {
    id: analyticsId
  });
  await buildShare(`${config.POST_SHARE_URL}/post/${item?.id}`);
};

const shareFeeds = async (item, analyticsLogEvent, analyticsId) => {
  Analytics.logEvent(analyticsLogEvent, {
    id: analyticsId
  });
  await buildShare(`${config.POST_SHARE_URL}/post/${item?.id}`);
};

const shareUserLink = (username) => buildShare(`${config.SHARE_URL}/${username}`);

const copyToClipboard = (username) => {
  Clipboard.setString(`${config.SHARE_URL}/${username}`);
};

const copyMessageWithoutLink = (message) => {
  Clipboard.setString(message);
};

const ShareUtils = {
  shareDomain,
  shareFeeds,
  shareNews,
  sharePostInProfile,
  sharePostInTopic,
  shareUserLink,
  shareCommunity,
  copyToClipboard,
  copyMessageWithoutLink
};

export default ShareUtils;
