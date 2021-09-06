import * as React from 'react';
import {Alert, Image, Linking, StyleSheet, View, StatusBar} from 'react-native';

import {useNavigation} from '@react-navigation/core';
import analytics from '@react-native-firebase/analytics';
import SplashScreenPackage from 'react-native-splash-screen';

import {verifyTokenGetstream} from '../../service/users';
import {getProfileByUsername} from '../../service/profile';
import {getAccessToken} from '../../utils/token';
import StringConstant from '../../utils/string/StringConstant';
import {useClientGetstream} from '../../utils/getstream/ClientGetStram';
import {getUserId} from '../../utils/users';

const SplashScreen = () => {
  const navigation = useNavigation();
  const BASE_DEEPLINK_URL_REGEX = 'link.bettersocial.org';
  let [isModalShown, setIsModalShown] = React.useState(false);
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
          if (!otherProfile) {
            Alert.alert(
              StringConstant.splashScreenDeeplinkGetProfileNotFound(username),
            );
          }
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
        navigation.replace('OtherProfile', {
          data: {
            user_id: selfUserId,
            other_id: otherProfile.user_id,
            username: otherProfile.username,
          },
        });

        return setIsModalShown(false);
      }
    } catch (e) {
      return navigateWithoutDeeplink(null);
    }
  };

  let navigateWithoutDeeplink = (selfUserId) => {
    SplashScreenPackage.hide();
    navigation.replace(selfUserId ? 'HomeTabs' : 'SignIn');
  };

  let doVerifyUser = async () => {
    try {
      let token = await getAccessToken();
      let id = await getUserId();
      console.log(token);
      if (id !== null && id !== '') {
        const verify = await verifyTokenGetstream();
        if (verify !== null && verify !== '') {
          create();
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
      if (response.code === 200) {
        return response.data;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <Image
        style={styles.image}
        source={require('../../assets/splash_screen.png')}
      />
    </View>
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
