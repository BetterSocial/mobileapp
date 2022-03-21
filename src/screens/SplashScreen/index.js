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
import {useNavigation} from '@react-navigation/core';

import following from '../../context/actions/following';
import { Context } from '../../context';
import {getAccessToken} from '../../utils/token';
import { getDomains, getFollowedDomain } from '../../service/domain';
import {getFollowing, getProfileByUsername} from '../../service/profile';
import { getFollowingTopic } from '../../service/topics';
import {getUserId} from '../../utils/users';
import { setNews } from '../../context/actions/news';
import {useClientGetstream} from '../../utils/getstream/ClientGetStram';
import {verifyTokenGetstream} from '../../service/users';

const SplashScreen = () => {
  const navigation = useNavigation();
  const BASE_DEEPLINK_URL_REGEX = 'link.bettersocial.org';
  let [isModalShown, setIsModalShown] = React.useState(false);

  const [, newsDispatch] = React.useContext(Context).news
  const [, followingDispatch] = React.useContext(Context).following

  const create = useClientGetstream();
  React.useEffect(() => {
    analytics().logScreenView({
      screen_class: 'SplashScreen',
      screen_name: 'Splash Screen',
    });

    getDeepLinkUrl();
  }, []);

  let getDeepLinkUrl = async () => {
    try {
      let selfUserId = await doVerifyUser();
      let deepLinkUrl = await Linking.getInitialURL();
      if (deepLinkUrl === null) {
        return navigateWithoutDeeplink(selfUserId);
      }

      let match = deepLinkUrl.match(`(?<=${BASE_DEEPLINK_URL_REGEX}\/).+`);
      if (match.length > 0) {
        setIsModalShown(true);
        let username = match[0];
        let otherProfile = await doGetProfileByUsername(username);

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

        SplashScreenPackage.hide();
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

  let navigateWithoutDeeplink = async (selfUserId) => {
    await SplashScreenPackage.hide();
    await getDiscoveryData(selfUserId)
    navigation.replace(selfUserId ? 'HomeTabs' : 'SignIn');
    // navigation.replace(selfUserId ? 'DiscoveryScreen' : 'SignIn');
  };

  let doVerifyUser = async () => {
    try {
      let token = await getAccessToken();
      let id = await getUserId();
      if (id !== null && id !== '') {
        const verify = await verifyTokenGetstream();
        if (verify !== null && verify !== '') {
          create();
          console.log('user id');
          console.log(id);
          return id;
        } else {
          return null;
        }
      }
      return null;
    } catch (e) {
      console.log('doVerifyUser ', e);
      return null;
    }
  };

  let doGetProfileByUsername = async (username) => {
    try {
      let response = await getProfileByUsername(username);
      console.log('response.data')
      console.log(response.data)
      if (response.code === 200) {
        console.log('response.data')
        console.log(response.data)
        return response.data;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const getDiscoveryData = async (selfUserId) => {
    if(!selfUserId) return
    // Not using await so splash screen can navigate to next screen faster
    

    try {
      getFollowing(selfUserId).then((res) => {
        console.log('saving following users')
        // console.log(res.data)
        following.setFollowingUsers(res.data, followingDispatch)
      }) 

      getDomains().then((res) => {
        setNews([{ dummy: true}, ...res.data], newsDispatch)
      }) 

      getFollowedDomain().then((res) => {
        console.log('saving following domains')
        following.setFollowingDomain(res.data.data, followingDispatch)
      })

      getFollowingTopic().then((res) => {
        console.log('saving following topics')
        following.setFollowingTopics(res.data, followingDispatch)
      })
    } catch(e) {
      console.log(e)
    }
    
    return
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <Image
        style={styles.image}
        source={require('../../assets/splash_screen.png')}
      />
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
