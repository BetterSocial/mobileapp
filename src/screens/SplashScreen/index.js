import * as React from 'react';
import SplashScreenPackage from 'react-native-splash-screen';
import analytics from '@react-native-firebase/analytics';
import {
  Image,
  Linking,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { StackActions } from '@react-navigation/native';
import { debounce } from 'lodash';
import following from '../../context/actions/following';
import { Context } from '../../context';
import { getAccessToken } from '../../utils/token';
import { getDomains, getFollowedDomain } from '../../service/domain';
import { getFollowing, getProfileByUsername } from '../../service/profile';
import { getFollowingTopic } from '../../service/topics';
import { getUserId } from '../../utils/users';
import { setNews } from '../../context/actions/news';
import { useClientGetstream } from '../../utils/getstream/ClientGetStram';
import { verifyTokenGetstream } from '../../service/users';

const SplashScreen = () => {
  const navigation = useNavigation();
  const BASE_DEEPLINK_URL_REGEX = 'link.bettersocial.org';
  const [isModalShown, setIsModalShown] = React.useState(false);

  const [, newsDispatch] = React.useContext(Context).news;
  const [, followingDispatch] = React.useContext(Context).following;
  const create = useClientGetstream();
  const debounceNavigationPage = debounce((selfUserId) => {
    navigation.dispatch(StackActions.replace(selfUserId ? 'HomeTabs' : 'SignIn'));
  }, 500);

  const getDiscoveryData = async (selfUserId) => {
    if (!selfUserId) {
      SplashScreenPackage.hide();
      return debounceNavigationPage(selfUserId);
    }
    // Not using await so splash screen can navigate to next screen faster

    try {
      const followingUser = await getFollowing(selfUserId);
      const domains = await getDomains();
      const followedDomain = await getFollowedDomain();
      const followingTopic = await getFollowingTopic();
      await following.setFollowingUsers(followingUser.data, followingDispatch);
      await setNews([{ dummy: true }, ...domains.data], newsDispatch);
      await following.setFollowingDomain(followedDomain.data.data, followingDispatch);
      await following.setFollowingTopics(followingTopic.data, followingDispatch);
      SplashScreenPackage.hide();
      debounceNavigationPage(selfUserId);
    } catch (e) {
      console.log(e);
    }
  };

  const navigateWithoutDeeplink = async (selfUserId) => {
    await getDiscoveryData(selfUserId);
  };

  const doGetProfileByUsername = async (username) => {
    try {
      const response = await getProfileByUsername(username);
      console.log('response.data');
      console.log(response.data);
      if (response.code === 200) {
        console.log('response.data');
        console.log(response.data);
        return response.data;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const doVerifyUser = async () => {
    try {
      const token = await getAccessToken();
      const id = await getUserId();
      if (id !== null && id !== '') {
        const verify = await verifyTokenGetstream();
        if (verify !== null && verify !== '') {
          create();
          console.log('user id');
          console.log(id);
          return id;
        }
        return null;
      }
      return null;
    } catch (e) {
      console.log('doVerifyUser ', e);
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
