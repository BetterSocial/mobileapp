// import dynamicLinks from '@react-native-firebase/dynamic-links';
import config from 'react-native-config';
import {Alert, Share} from 'react-native';

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

const shareDomain = (item) => {
  if (__DEV__) {
    console.log('Share in domain', item);
  }
};

const shareNews = async (item) => {
  await buildShare(`${item?.content?.url}`);
};

const sharePostInTopic = async (item, analyticsLogEvent, analyticsId) => {
  Analytics.logEvent(analyticsLogEvent, {
    id: analyticsId
  });
  await buildShare(`${config.POST_SHARE_URL}/post/${item?.id}`);
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

const shareUserLink = (username) => buildShare(`${config.SHARE_URL}/u/${username}`);

// const buildLink = async (item) => {
//     const link = await dynamicLinks().buildLink({
//         link: `https://dev.bettersocial.org/${item}`,
//         domainUriPrefix: 'https://bettersocialapp.page.link',
//         analytics: {
//             campaign: 'banner',
//         },
//         navigation: {
//             forcedRedirectEnabled: false,
//         },
//         // ios: {
//         //   bundleId: '',
//         //   // customScheme: 'giftit',
//         //   appStoreId: '',
//         // },
//         android: {
//             packageName: 'org.bettersocial.dev',
//         },
//     },
//         'SHORT',
//     );
//     return link;
// }

const ShareUtils = {
  shareDomain,
  shareFeeds,
  shareNews,
  sharePostInProfile,
  sharePostInTopic,
  shareUserLink
};

export default ShareUtils;
