import * as React from 'react';
import PushNotification from 'react-native-push-notification';
/* eslint-disable no-use-before-define */
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';
import {Platform, SafeAreaView, StyleSheet, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useRecoilState, useRecoilValue} from 'recoil';

import AnonymousChatFill from '../assets/icon/AnonymousChatFill';
import AnonymousChatOutline from '../assets/icon/AnonymousChatOutline';
import ChannelListScreenV2 from '../screens/ChannelListScreenV2';
import FirebaseConfig from '../configs/FirebaseConfig';
import MemoFeed from '../assets/icon/Feed';
import MemoNews from '../assets/icon/News';
import MemoProfileIcon from '../assets/icon/Profile';
import SignedChat from '../assets/icon/SignedChat';
import StorageUtils from '../utils/storage';
import profileAtom from '../atom/profileAtom';
import useCoreChatSystemHook from '../hooks/core/useCoreChatSystemHook';
import useRootChannelListHook from '../hooks/screen/useRootChannelListHook';
import TokenStorage, {ITokenEnum} from '../utils/storage/custom/tokenStorage';
import {ChannelListScreen, FeedScreen, NewsScreen, ProfileScreen} from '../screens';
import {InitialStartupAtom, otherProfileAtom} from '../service/initialStartup';
import {colors} from '../utils/colors';
import {getAnonymousUserId, getUserId} from '../utils/users';

const Tab = createBottomTabNavigator();

function HomeBottomTabs({navigation}) {
  useCoreChatSystemHook();
  const isIos = Platform.OS === 'ios';
  const initialStartup = useRecoilValue(InitialStartupAtom);
  const otherProfileData = useRecoilValue(otherProfileAtom);
  const [, setProfileAtom] = useRecoilState(profileAtom);
  const {signedChannelUnreadCount, anonymousChannelUnreadCount} = useRootChannelListHook();

  let isOpenNotification = false;

  const helperNavigationResetWithData = (screenData) => {
    setTimeout(() => {
      if (!isOpenNotification) {
        isOpenNotification = true;
        navigation.reset({
          index: 1,
          routes: [
            {
              name: 'AuthenticatedStack',
              params: {
                screen: 'HomeTabs',
                params: {
                  screen: 'ChannelList'
                }
              }
            },
            {
              ...screenData
            }
          ]
        });
      }
    }, 500);
  };

  const handleNotification = async (notification) => {
    if (notification.data.type === 'feed' || notification.data.type === 'reaction') {
      navigation.navigate('PostDetailPage', {
        feedId: notification.data.feed_id,
        is_from_pn: true
      });
    }
    if (notification.data.type === 'follow_user') {
      navigation.navigate('OtherProfile', {
        data: {
          user_id: notification.data.user_id,
          other_id: notification.data.user_id_follower,
          username: notification.data.username_follower
        }
      });
    }
    if (notification.data.type === 'message.new') {
      helperNavigationResetWithData({
        name: 'AuthenticatedStack',
        params: {
          screen: 'ChatDetailPage',
          params: {
            data: notification.data
          }
        }
      });
    }
  };

  PushNotification.configure({
    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification(notification) {
      handleNotification(notification);
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
      sound: true
    },
    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,
    requestPermissions: false
  });

  const pushNotifIos = (message) => {
    if (__DEV__) {
      console.log(message.messageId, 'message');
    }
    const {title, body} = message.notification;
    PushNotificationIOS.addNotificationRequest({
      title,
      body,
      id: message.messageId,
      userInfo: message.data
    });
  };

  const pushNotifAndroid = (remoteMessage) => {
    const {title, body} = remoteMessage.notification;
    PushNotification.localNotification({
      id: '123',
      title,
      channelId: 'bettersosialid',
      message: body,
      data: remoteMessage.data
    });
  };

  const createChannel = () => {
    PushNotification.createChannel(
      {
        channelId: 'bettersosialid', // (required)
        channelName: 'New Messages & Comments', // (required)
        playSound: true, // (optional) default: true
        soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true // (optional) default: true. Creates the default vibration patten if true.
      },
      (created) => {
        if (__DEV__) {
          console.log(`createChannel returned '${created}'`);
        }
      } // (optional) callback returns whether the channel was created, false means it already existed.
    );
  };

  const handlePushNotif = (remoteMessage) => {
    const {data} = remoteMessage;
    if (data.channel_type !== 3) {
      if (isIos) {
        pushNotifIos(remoteMessage);
      } else {
        pushNotifAndroid(remoteMessage);
      }
    }
  };

  const updateProfileAtomId = async () => {
    const signedUserId = await getUserId();
    const anonUserId = await getAnonymousUserId();
    const token = TokenStorage.get(ITokenEnum.token);
    const anonymousToken = TokenStorage.get(ITokenEnum.anonymousToken);

    setProfileAtom({
      anonProfileId: anonUserId,
      signedProfileId: signedUserId,
      token,
      anonymousToken
    });
  };

  React.useEffect(() => {
    createChannel();
    updateProfileAtomId();

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Message handled in the background!', remoteMessage);
      handlePushNotif(remoteMessage);
    });

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Message handled in the background!', remoteMessage);
      handlePushNotif(remoteMessage);
    });

    const unsubscribe = messaging().onMessage((remoteMessage) => {
      // eslint-disable-next-line no-unused-expressions
      handlePushNotif(remoteMessage);
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
          username: otherProfileData.username
        }
      });
    }
  }, [initialStartup, otherProfileData]);

  const renderTabBarIcon = (route, focused, color) => {
    if (route.name === 'SignedChannelList') {
      return (
        <View style={styles.center}>
          <SignedChat fill={color} stroke={color} />
        </View>
      );
    }
    if (route.name === 'AnonymousChannelList') {
      return (
        <View style={styles.center}>
          {focused ? (
            <AnonymousChatFill fill={colors.anon_primary} stroke={colors.anon_primary} />
          ) : (
            <AnonymousChatOutline fill={color} />
          )}
        </View>
      );
    }
    if (route.name === 'Feed') {
      return (
        <View style={styles.center}>
          <MemoFeed fill={color} />
        </View>
      );
    }
    if (route.name === 'News') {
      return (
        <View>
          <MemoNews fill={color} />
        </View>
      );
    }

    return (
      <View style={styles.center}>
        <MemoProfileIcon />
      </View>
    );
  };

  const lastMenu = StorageUtils.lastSelectedMenu.get();
  const getInitialRouteName = React.useCallback(() => {
    if (initialStartup !== null && otherProfileData?.user_id === initialStartup.id) {
      return 'Profile';
    }

    return lastMenu ?? 'Feed';
  }, [lastMenu]);

  const saveLastMenu = (route) => ({
    tabPress: () => {
      StorageUtils.lastSelectedMenu.set(route?.name);
    }
  });

  const menuIndicator = (nav, route) => {
    const isAnonChatMenu = route.name === 'AnonymousChannelList';
    const activeColor = isAnonChatMenu ? colors.anon_primary : colors.darkBlue;
    const style = {backgroundColor: nav.isFocused() ? activeColor : 'transparent'};
    return <View style={[styles.badge, style]} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Tab.Navigator
        initialRouteName={getInitialRouteName()}
        tabBarOptions={{
          inactiveTintColor: colors.gray1,
          safeAreaInsets: {top: 0, bottom: 0, left: 0, right: 0}
        }}
        screenOptions={({navigation: nav, route}) => ({
          tabBarLabel: () => menuIndicator(nav, route),
          tabBarIcon: ({focused, color}) => renderTabBarIcon(route, focused, color),
          tabBarActiveTintColor:
            route.name === 'AnonymousChannelList' ? colors.anon_primary : colors.darkBlue
        })}>
        <Tab.Screen
          name="SignedChannelList"
          component={ChannelListScreen}
          initialParams={{isBottomTab: true}}
          listeners={({route}) => saveLastMenu(route)}
          options={{tabBarBadge: signedChannelUnreadCount > 0 ? signedChannelUnreadCount : null}}
        />
        <Tab.Screen
          name="AnonymousChannelList"
          component={ChannelListScreenV2}
          initialParams={{isBottomTab: true}}
          listeners={({route}) => saveLastMenu(route)}
          options={{
            tabBarBadge: anonymousChannelUnreadCount > 0 ? anonymousChannelUnreadCount : null
          }}
        />
        <Tab.Screen
          name="Feed"
          component={FeedScreen}
          initialParams={{isBottomTab: true}}
          listeners={({route}) => saveLastMenu(route)}
        />
        <Tab.Screen
          name="News"
          component={NewsScreen}
          initialParams={{isBottomTab: true}}
          listeners={({route}) => saveLastMenu(route)}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          initialParams={{isBottomTab: true}}
          listeners={({route}) => saveLastMenu(route)}
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
    backgroundColor: 'white'
  },
  badge: {
    height: 7,
    width: 7,
    position: 'absolute',
    bottom: 3,
    borderRadius: 3.5
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    width: 21,
    height: 20
  }
});
