import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';
import { Platform, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import DiscoveryAction from '../context/actions/discoveryAction';
import FirebaseConfig from '../configs/FirebaseConfig';
import MemoFeed from '../assets/icon/Feed';
import MemoHome from '../assets/icon/Home';
import MemoNews from '../assets/icon/News';
import MemoProfileIcon from '../assets/icon/Profile';
import following from '../context/actions/following';
import {
  ChannelListScreen,
  FeedScreen,
  NewsScreen,
  ProfileScreen,
} from '../screens';
import { Context } from '../context';
import { FEEDS_CACHE, NEWS_CACHE, PROFILE_CACHE, RECENT_SEARCH_TERMS } from '../utils/cache/constant';
import { colors } from '../utils/colors';
import { getDomains, getFollowedDomain } from '../service/domain';
import { getFollowing, getMyProfile } from '../service/profile';
import { getFollowingTopic } from '../service/topics';
import { getMainFeed } from '../service/post';
import { getSpecificCache, saveToCache } from '../utils/cache';
import { getUserId } from '../utils/users';
import { setFeedByIndex, setMainFeeds, setTimer, setViewPostTimeIndex } from '../context/actions/feeds';
import { setImageUrl } from '../context/actions/users';
import { setMyProfileAction } from '../context/actions/setMyProfileAction';
import { setNews } from '../context/actions/news';

const Tab = createBottomTabNavigator();

function HomeBottomTabs(props) {
  const { navigation } = props
  const isIos = Platform.OS === 'ios'

  let [users, dispatchUser] = React.useContext(Context).users;
  let [, dispatchProfile] = React.useContext(Context).profile;
  let [, followingDispatch] = React.useContext(Context).following;
  const [, newsDispatch] = React.useContext(Context).news;
  const [feedsContext, dispatchFeeds] = React.useContext(Context).feeds;
  const [, discoveryDispatch] = React.useContext(Context).discovery;
  const [unReadMessage] = React.useContext(Context).unReadMessage;
  const [loadingUser, setLoadingUser] = React.useState(true)
  let { feeds, timer, viewPostTimeIndex } = feedsContext;

  PushNotification.configure({
    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification(notification) {
      console.log('NOTIFICATION:', notification);
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

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  };

  const getProfile = async () => {
    try {
      let selfUserId = await getUserId();
      let profile = await getMyProfile(selfUserId);
      setImageUrl(profile.data.profile_pic_path, dispatchUser);
      let data = {
        user_id: profile.data.user_id,
        username: profile.data.username,
      };
      saveToCache(PROFILE_CACHE, profile.data)
      setMyProfileAction(data, dispatchProfile);
      setLoadingUser(false)
    } catch (e) {
      setLoadingUser(false)
    }
  };

  const getDiscoveryData = async () => {
    let selfUserId = await getUserId();
    // Not using await so splash screen can navigate to next screen faster

    let response = await AsyncStorage.getItem(RECENT_SEARCH_TERMS)
    if (!response) return
    // setItems(JSON.parse(response))
    DiscoveryAction.setDiscoveryRecentSearch(JSON.parse(response), discoveryDispatch)

    try {
      getFollowing(selfUserId).then((response) => {
        console.log('asdadadasdadadasd')
        following.setFollowingUsers(response.data, followingDispatch);
      });

      getFollowedDomain().then((response) => {
        following.setFollowingDomain(response.data.data, followingDispatch);
      });

      getFollowingTopic().then((response) => {
        following.setFollowingTopics(response.data, followingDispatch);
      });

    } catch (e) {
      console.log('error')
      console.log(e)
      throw new Error(e)
    }
  }

  const pushNotifIos = (message) => {
    PushNotificationIOS.addNotificationRequest({
      alertBody: message.notification.body,
      alertTitle: message.notification.title
    })
  }

  const pushNotifAndroid = (remoteMessage) => {
    PushNotification.localNotification({
      id: '123',
      title: remoteMessage.notification.title,
      channelId: 'bettersosialid',
      message: remoteMessage.notification.body,
    });
  }

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
      (created) => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    );
  };

  const getDomain = () => {
    getDomains().then((response) => {
      saveToCache(NEWS_CACHE, response)
      setNews(response.data, newsDispatch);
    }).catch((e) => {
      throw new Error(e)
    })
  }

  const getDataFeeds = async (offset = 0) => {
    try {
      let query = `?offset=${offset}`

      const dataFeeds = await getMainFeed(query);
      if (dataFeeds.data.length > 0) {
        let data = dataFeeds.data;
        let dataWithDummy = [...data, { dummy: true }]
        let saveData = {
          offset: dataFeeds.offset,
          data: dataWithDummy

        }
        if (offset === 0) {
          setMainFeeds(dataWithDummy, dispatchFeeds);
          saveToCache(FEEDS_CACHE, saveData)
        } else {
          let clonedFeeds = [...feeds]
          clonedFeeds.splice(feeds.length - 1, 0, ...data)
          saveData = {
            ...saveData,
            data: clonedFeeds
          }
          setMainFeeds(clonedFeeds, dispatchFeeds);
          saveToCache(FEEDS_CACHE, saveData)
        }
      }
      setTimer(new Date(), dispatchFeeds)
    } catch (e) {
      throw new Error(e)
    }
  };

  React.useEffect(() => {
    getSpecificCache(PROFILE_CACHE, (res) => {
      if (!res) {
        getProfile()
      } else {
        let data = {
          user_id: res.user_id,
          username: res.username,
        };
        setMyProfileAction(data, dispatchProfile)
        setLoadingUser(false)
        setImageUrl(res.profile_pic_path, dispatchUser)
      }
    })
  }, [])



  React.useEffect(() => {
    requestPermission()
    getDomain()
    getDataFeeds()
    getDiscoveryData()
  }, []);
  React.useEffect(() => {
    createChannel()
    const unsubscribe = messaging().onMessage((remoteMessage) => {
      !isIos ? pushNotifAndroid(remoteMessage) : pushNotifIos(remoteMessage)

    });
    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <Tab.Navigator
        initialRouteName="ChannelList"
        // initialRouteName="Profile"
        tabBarOptions={{
          // showLabel: true,
          activeTintColor: colors.holytosca,
          inactiveTintColor: colors.gray1,
        }}
        screenOptions={({ route, navigation }) => {
          return {
            activeTintColor: colors.holytosca,
            tabBarLabel: () => (
              <Text style={styles.label}>
                {navigation.isFocused() ? '\u2B24' : ''}
              </Text>
            ),
          };
        }}>
        <Tab.Screen
          name="ChannelList"
          component={ChannelListScreen}
          options={{
            activeTintColor: colors.holytosca,
            tabBarIcon: ({ color }) => <MemoHome fill={color} />,
            tabBarBadge: unReadMessage.total_unread_count
              ? unReadMessage.total_unread_count
              : null,

          }}
        />
        <Tab.Screen
          name="Feed"
          component={FeedScreen}
          options={{
            activeTintColor: colors.holytosca,
            tabBarIcon: ({ color }) => <MemoFeed fill={color} />,
            // unmountOnBlur: true
          }}
        />
        <Tab.Screen
          name="News"
          component={NewsScreen}
          options={{
            activeTintColor: colors.holytosca,
            tabBarIcon: ({ focused, color }) => <MemoNews fill={color} />,
            // unmountOnBlur: true
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            activeTintColor: colors.holytosca,
            tabBarIcon: ({ focused }) => <MemoProfileIcon loadingUser={loadingUser} uri={users.photoUrl} />,
            // unmountOnBlur:true
          }}
        />
      </Tab.Navigator>
      <FirebaseConfig navigation={navigation} />
    </SafeAreaView>
  );
}

export default HomeBottomTabs;
const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  },
  label: {
    fontSize: 6,
    color: colors.holytosca,
    marginTop: -12,
    marginBottom: 5,
    alignSelf: 'center',
  },
});
