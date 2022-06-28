import { Linking } from 'react-native';

import { getProfileByUsername } from '../service/profile';
import { rejuvenateApp } from '../context/actions/initialStartupAction';

const BASE_DEEPLINK_URL_REGEX = 'link.bettersocial.org/u';

const doGetProfileByUsername = async (username) => {
  try {
    const response = await getProfileByUsername(username);
    if (response.code === 200) {
      return response.data;
    }
    return false;
  } catch (e) {
    return false;
  }
};

const getDeepLinkUrl = async (userId, dispatch) => {
  try {
    const deepLinkUrl = await Linking.getInitialURL();

    const match = deepLinkUrl.match(`(?<=${BASE_DEEPLINK_URL_REGEX}\/).+`);
    if (match.length > 0) {
      const username = match[0];
      const otherProfile = await doGetProfileByUsername(username);

      // Check if myself
      rejuvenateApp({ id: userId, deeplinkProfile: userId === otherProfile.user_id }, dispatch);
    }
  } catch (e) {
    // eslint-disable-next-line no-undef
    // if (__DEV__) {
    console.log('getDeeplinkUrl error :', e);
    // }
  }
};

// eslint-disable-next-line import/prefer-default-export
export { getDeepLinkUrl };
