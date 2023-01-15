import * as React from 'react';
import SplashScreenPackage from 'react-native-splash-screen';
import analytics from '@react-native-firebase/analytics';
import {
  Linking,
} from 'react-native';
import { StackActions } from '@react-navigation/native';
import { debounce } from 'lodash';
import { useNavigation } from '@react-navigation/core';

import { Context } from '../../context/Store';
import { getFollowing, getProfileByUsername } from '../../service/profile';
import { getUserId } from '../../utils/users';
import { setNews } from '../../context/actions/news';
import { useClientGetstream } from '../../utils/getstream/ClientGetStram';
import { verifyTokenGetstream } from '../../service/users';

const SplashScreen = () => {
  const navigation = useNavigation();
  const BASE_DEEPLINK_URL_REGEX = 'link.bettersocial.org/u';
  const [isModalShown, setIsModalShown] = React.useState(false);

  const [, newsDispatch] = React.useContext(Context).news;
  const [, followingDispatch] = React.useContext(Context).following;
  const create = useClientGetstream();
  const debounceNavigationPage = (selfUserId) => {
    navigation.dispatch(StackActions.replace(selfUserId ? 'HomeTabs' : 'SignIn'));
  };

  const getDiscoveryData = async (selfUserId) => {
    SplashScreenPackage.hide();
    debounceNavigationPage(selfUserId);
  };

  const navigateWithoutDeeplink = async (selfUserId) => {
    await getDiscoveryData(selfUserId);
  };

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

  const doVerifyUser = async () => {
    try {
      const id = await getUserId();
      if (id !== null && id !== '') {
        const verify = await verifyTokenGetstream();
        if (verify !== null && verify !== '') {
          create();
          return id;
        }
        return null;
      }
      return null;
    } catch (e) {
      if (__DEV__) {
        console.log('doVerifyUser ', e);
      }
      return null;
    }
  };

  const getDeepLinkUrl = async () => {
    try {
      const selfUserId = await doVerifyUser();
      const deepLinkUrl = await Linking.getInitialURL();
      if (deepLinkUrl === null) {
        return navigateWithoutDeeplink(selfUserId);
      }

      const match = deepLinkUrl.match(`(?<=${BASE_DEEPLINK_URL_REGEX}\/).+`);
      if (match.length > 0) {
        setIsModalShown(true);
        const username = match[0];
        const otherProfile = await doGetProfileByUsername(username);

        if (!selfUserId || !otherProfile) {
          return navigateWithoutDeeplink(selfUserId);
        }

        // Check if myself
        if (selfUserId === otherProfile.user_id) {
          navigation.replace('HomeTabs', {
            screen: 'Profile',
          });
          return setIsModalShown(false);
        }
        // navigation.replace('OtherProfile', {
        //   data: {
        //     user_id: selfUserId,
        //     other_id: otherProfile.user_id,
        //     username: otherProfile.username,
        //   },
        // });

        return setIsModalShown(false);
      }
    } catch (e) {
      return navigateWithoutDeeplink(null);
    }
  };

  React.useEffect(() => {
    analytics().logScreenView({
      screen_class: 'SplashScreen',
      screen_name: 'Splash Screen',
    });

    getDeepLinkUrl();
  }, []);

  return (
    null
  );
};

export default SplashScreen;
