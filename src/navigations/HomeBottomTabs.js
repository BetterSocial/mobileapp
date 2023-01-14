import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';
import {
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useRecoilValue } from 'recoil';

import DiscoveryAction from '../context/actions/discoveryAction';
import DiscoveryRepo from '../service/discovery';
import FirebaseConfig from '../configs/FirebaseConfig';
import MemoFeed from '../assets/icon/Feed';
import MemoHome from '../assets/icon/Home';
import MemoNews from '../assets/icon/News';
import MemoProfileIcon from '../assets/icon/Profile';
import UniversalLink from '../configs/UniversalLink';
import following from '../context/actions/following';
import {
  ChannelListScreen,
  FeedScreen,
  NewsScreen,
  ProfileScreen,
} from '../screens';
import { Context } from '../context';
import {
  FEEDS_CACHE,
  NEWS_CACHE,
  PROFILE_CACHE,
  RECENT_SEARCH_TERMS,
} from '../utils/cache/constant';
import { InitialStartupAtom, otherProfileAtom } from '../service/initialStartup';
import { colors } from '../utils/colors';
import { getDomains, getFollowedDomain } from '../service/domain';
import { getFollowing, getMyProfile } from '../service/profile';
import { getFollowingTopic } from '../service/topics';
import { getMainFeed } from '../service/post';
import { getSpecificCache, saveToCache } from '../utils/cache';
import { getUserId } from '../utils/users';
import {
  setMainFeeds,
  setTimer,
} from '../context/actions/feeds';
import { setMyProfileAction } from '../context/actions/setMyProfileAction';
import { setNews } from '../context/actions/news';

const Tab = createBottomTabNavigator();

function HomeBottomTabs(props) {
  const { navigation } = props;
  const isIos = Platform.OS === 'ios';
  const [myProfile, dispatchProfile] = React.useContext(Context).profile;
  const [, followingDispatch] = React.useContext(Context).following;

  const initialStartup = useRecoilValue(InitialStartupAtom);
  const otherProfileData = useRecoilValue(otherProfileAtom);
  const [, newsDispatch] = React.useContext(Context).news;
  const [feedsContext, dispatchFeeds] = React.useContext(Context).feeds;
  const [, discoveryDispatch] = React.useContext(Context).discovery;
  const [unReadMessage] = React.useContext(Context).unReadMessage;
  const [loadingUser, setLoadingUser] = React.useState(true);
  const { feeds } = feedsContext;
  const LIMIT_FIRST_FEEDS = 1;
  const LIMIT_FIRST_NEWS = 3;



  PushNotification.configure({
    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification(notification) {
      if (__DEV__) {
        console.log('NOTIFICATION:', notification);
      }
      // process the notification
      // (required) Called when a remote is received or opened, or local notification is opened
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    // (optional) Called when the user fails to register for remote notifications.
    // Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    onRegistrationError(err) {
      console.error(err.message, err);
    },
    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,
    requestPermissions: true,
  });

  const requestPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED
      || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled && __DEV__) {
      console.log('Authorization status:', authStatus);
    }
  };
  const getProfile = async () => {
    try {
      const selfUserId = await getUserId();
      const profile = await getMyProfile(selfUserId);
      saveToCache(PROFILE_CACHE, profile.data);
      setMyProfileAction(profile.data, dispatchProfile);
      setLoadingUser(false);
    } catch (e) {
      setLoadingUser(false);
    }
  };

  const getDiscoveryData = async () => {
    const selfUserId = await getUserId();
    // Not using await so splash screen can navigate to next screen faster

    try {
      getFollowing(selfUserId).then((response) => {
        following.setFollowingUsers(response.data, followingDispatch);
      });

      getFollowedDomain().then((response) => {
        following.setFollowingDomain(response.data.data, followingDispatch);
      });

      getFollowingTopic().then((response) => {
        following.setFollowingTopics(response.data, followingDispatch);
      });

      const discoveryInitialUserResponse = await DiscoveryRepo.fetchInitialDiscoveryUsers();
      DiscoveryAction.setDiscoveryInitialUsers(
        discoveryInitialUserResponse.suggestedUsers,
        discoveryDispatch,
      );

      const discoveryInitialTopicResponse = await DiscoveryRepo.fetchInitialDiscoveryTopics();
      DiscoveryAction.setDiscoveryInitialTopics(
        discoveryInitialTopicResponse.suggestedTopics,
        discoveryDispatch,
      );

      const discoveryInitialDomainResponse = await DiscoveryRepo.fetchInitialDiscoveryDomains();
      DiscoveryAction.setDiscoveryInitialDomains(
        discoveryInitialDomainResponse.suggestedDomains,
        discoveryDispatch,
      );

      const response = await AsyncStorage.getItem(RECENT_SEARCH_TERMS);
      if (!response) return;
      // setItems(JSON.parse(response))
      DiscoveryAction.setDiscoveryRecentSearch(JSON.parse(response), discoveryDispatch);
    } catch (e) {
      if (__DEV__) {
        console.log('error');
        console.log(e);
      }
      throw new Error(e);
    }
  };

  const pushNotifIos = (message) => {
    if (__DEV__) {
      console.log(message.messageId, 'message');
    }
    PushNotificationIOS.addNotificationRequest({
      // alertBody: message.notification.body,
      // alertTitle: message.notification.title
      title: message.notification.title,
      body: message.notification.body,
      id: message.messageId
    })
  }

  const pushNotifAndroid = (remoteMessage) => {
    PushNotification.localNotification({
      id: '123',
      title: remoteMessage.notification.title,
      channelId: 'bettersosialid',
      message: remoteMessage.notification.body,
    });
  };

  const createChannel = () => {
    PushNotification.createChannel(
      {
        channelId: 'bettersosialid', // (required)
        channelName: 'bettersosial-chat', // (required)
        playSound: false, // (optional) default: true
        soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      (created) => {
        if (__DEV__) {
          console.log(`createChannel returned '${created}'`);
        }
      }, // (optional) callback returns whether the channel was created, false means it already existed.
    );
  };

  const getDomain = () => {
    getDomains(0, LIMIT_FIRST_NEWS).then((response) => {
      saveToCache(NEWS_CACHE, response);
      setNews(response.data, newsDispatch);
    }).catch((e) => {
      throw new Error(e);
    });
  };

  const getDataFeeds = async (offset = 0) => {
    try {
      const query = `?offset=${offset}&limit=${LIMIT_FIRST_FEEDS}`;
      const dataFeeds = await getMainFeed(query);
      if (dataFeeds.data.length > 0) {
        const { data } = dataFeeds;
        const dataWithDummy = [...data, { dummy: true }];
        let saveData = {
          offset: dataFeeds.offset,
          data: dataWithDummy,

        };
        if (offset === 0) {
          setMainFeeds(dataWithDummy, dispatchFeeds);
          saveToCache(FEEDS_CACHE, saveData);
        } else {
          const clonedFeeds = [...feeds];
          clonedFeeds.splice(feeds.length - 1, 0, ...data);
          saveData = {
            ...saveData,
            data: clonedFeeds,
          };
          setMainFeeds(clonedFeeds, dispatchFeeds);
          saveToCache(FEEDS_CACHE, saveData);
        }
      }
      setTimer(new Date(), dispatchFeeds);
    } catch (e) {
      throw new Error(e);
    }
  };

  React.useEffect(() => {
    getSpecificCache(PROFILE_CACHE, (res) => {
      if (!res) {
        getProfile();
      } else {
        setMyProfileAction(res, dispatchProfile);
        setLoadingUser(false);
      }
    });
  }, []);

  React.useEffect(() => {
    requestPermission();
    getDomain();
    getDataFeeds();
    getDiscoveryData();
  }, []);

  const handlePushNotif = (remoteMessage) => {
    let { channel } = remoteMessage.data
    channel = JSON.parse(channel)
    if (channel.channel_type !== 3) {
      if (isIos) {
        pushNotifIos(remoteMessage)
      } else {
        pushNotifAndroid(remoteMessage)
      }
    }
  }

  React.useEffect(() => {
    createChannel();
    const unsubscribe = messaging().onMessage((remoteMessage) => {
      // eslint-disable-next-line no-unused-expressions
      handlePushNotif(remoteMessage)
    });

    return () => {
      unsubscribe();
    };
  }, []);
  React.useEffect(() => {
    if (otherProfileData !== null && initialStartup.id !== null) {
      navigation.navigate('OtherProfile', {
        data: {
          user_id: initialStartup.id,
          other_id: otherProfileData.user_id,
          username: otherProfileData.username,
        },
      });
    }
  }, [initialStartup, otherProfileData]);


  return (
    <View style={styles.container}>
      <Tab.Navigator
        initialRouteName={initialStartup !== null && otherProfileData?.user_id === initialStartup.id ? 'Profile' : 'Feed'}
        tabBarOptions={{
          activeTintColor: colors.holytosca,
          inactiveTintColor: colors.gray1,
          safeAreaInsets: {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
          }
        }}
        screenOptions={({ navigation: screenOptionsNavigation }) => ({
          activeTintColor: colors.holytosca,
          tabBarLabel: () => (
            <View style={[styles.badge, { backgroundColor: screenOptionsNavigation.isFocused() ? colors.holytosca : 'transparent' }]} />
          ),
        })}>
        <Tab.Screen
          name="Feed"
          component={FeedScreen}
          options={{
            activeTintColor: colors.holytosca,
            tabBarIcon: ({ color }) => <View style={styles.center} ><MemoFeed fill={color} /></View>,
            // unmountOnBlur: true
          }}
        />
        <Tab.Screen
          name="ChannelList"
          component={ChannelListScreen}

          options={{
            activeTintColor: colors.holytosca,
            tabBarIcon: ({ color }) => <View style={styles.center} >
              <MemoHome fill={color} />
            </View>,
            tabBarBadge: unReadMessage.total_unread_count + unReadMessage.unread_post > 0 ? unReadMessage.total_unread_count + unReadMessage.unread_post : null
          }}
        />
        <Tab.Screen
          name="News"
          component={NewsScreen}
          options={{
            activeTintColor: colors.holytosca,
            tabBarIcon: ({ color }) => <View>
              <MemoNews fill={color} />
            </View>,
            // unmountOnBlur: true
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            activeTintColor: colors.holytosca,
            tabBarIcon: () => <View style={styles.center} >
              <MemoProfileIcon loadingUser={loadingUser} uri={myProfile.myProfile.profile_pic_path} />
            </View>,
            // unmountOnBlur:true
          }}
        />
      </Tab.Navigator>
      <FirebaseConfig navigation={navigation} />
      <UniversalLink navigation={navigation} />
    </View>
  );
}

export default HomeBottomTabs;
const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  },
  badge: {
    height: 7,
    width: 7,
    position: 'absolute',
    bottom: 3,
    borderRadius: 3.5
  },
  center: {
    alignItems: 'center', justifyContent: 'center'
  }
});
