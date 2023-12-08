import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import * as React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import PushNotification from 'react-native-push-notification';
import {useRecoilState, useRecoilValue} from 'recoil';

import MemoFeed from '../assets/icon/Feed';
import MemoHome from '../assets/icon/Home';
import MemoNews from '../assets/icon/News';
import MemoProfileIcon from '../assets/icon/Profile';
import profileAtom from '../atom/profileAtom';
import FirebaseConfig from '../configs/FirebaseConfig';
import useCoreChatSystemHook from '../hooks/core/useCoreChatSystemHook';
import useRootChannelListHook from '../hooks/screen/useRootChannelListHook';
import {FeedScreen, NewsScreen, ProfileScreen} from '../screens';
import ChannelListScreenV2 from '../screens/ChannelListScreenV2';
import {InitialStartupAtom, otherProfileAtom} from '../service/initialStartup';
import {colors} from '../utils/colors';
import TokenStorage, {ITokenEnum} from '../utils/storage/custom/tokenStorage';
import {getAnonymousUserId, getUserId} from '../utils/users';
import useChatUtilsHook, {chatAtom} from '../hooks/core/chat/useChatUtilsHook';
import SignedMessageRepo from '../service/repo/signedMessageRepo';
import ChatSchema from '../database/schema/ChatSchema';
import useLocalDatabaseHook from '../database/hooks/useLocalDatabaseHook';

const Tab = createBottomTabNavigator();

function HomeBottomTabs({navigation}) {
  useCoreChatSystemHook();
  const [chat, setChat] = useRecoilState(chatAtom);
  const {localDb} = useLocalDatabaseHook();
  const isIos = Platform.OS === 'ios';
  const initialStartup = useRecoilValue(InitialStartupAtom);
  const otherProfileData = useRecoilValue(otherProfileAtom);
  const [, setProfileAtom] = useRecoilState(profileAtom);
  const {totalUnreadCount} = useRootChannelListHook();
  const {goToChatScreen} = useChatUtilsHook();
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
      console.log(notification, 'lapak');
      const response = await SignedMessageRepo.getChatDetail(
        notification?.data?.channel_type,
        notification?.data?.channel_id
      );
      const newChat = await ChatSchema.generateReceiveChat(
        response.data.channel.id,
        response.data.messages?.[0]?.user?.id,
        response.data.channel.cid,
        response.data.messages?.[0]?.text,
        localDb,
        'regular',
        'sent'
      );
      if (newChat) {
        newChat.save(localDb);
      }
      console.log({data: response.data, newChat}, 'nana');
      goToChatScreen(response.data.channel);
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
        channelName: 'bettersosial-chat', // (required)
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

  const renderTabLabelIcon =
    (componentType) =>
    // eslint-disable-next-line react/display-name
    ({color}) => {
      if (componentType === 'Feed') {
        return (
          <View style={styles.center}>
            <MemoFeed fill={color} />
          </View>
        );
      }
      if (componentType === 'ChannelList') {
        return (
          <View style={styles.center}>
            <MemoHome fill={color} />
          </View>
        );
      }
      if (componentType === 'News') {
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
  // eslint-disable-next-line react/display-name

  return (
    <View style={styles.container}>
      <Tab.Navigator
        initialRouteName={
          initialStartup !== null && otherProfileData?.user_id === initialStartup.id
            ? 'Profile'
            : 'Feed'
        }
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
        screenOptions={({navigation: screenOptionsNavigation}) => ({
          activeTintColor: colors.holytosca,
          tabBarLabel: () => (
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: screenOptionsNavigation.isFocused()
                    ? colors.holytosca
                    : 'transparent'
                }
              ]}
            />
          )
        })}>
        <Tab.Screen
          name="Feed"
          component={FeedScreen}
          initialParams={{isBottomTab: true}}
          options={{
            activeTintColor: colors.holytosca,
            tabBarIcon: renderTabLabelIcon('Feed')
            // unmountOnBlur: true
          }}
        />
        {/* <Tab.Screen
          name="Feed"
          component={WebsocketResearchScreen}
          initialParams={{isBottomTab: true}}
          options={{
            activeTintColor: colors.holytosca,
            tabBarIcon: renderTabLabelIcon('Feed')
            // unmountOnBlur: true
          }}
        /> */}
        {/* <Tab.Screen
          name="ChannelList"
          component={ChannelListScreen}
          initialParams={{isBottomTab: true}}
          options={{
            activeTintColor: colors.holytosca,
            tabBarIcon: renderTabLabelIcon('ChannelList'),
            tabBarBadge:
              unReadMessage.total_unread_count + unReadMessage.unread_post > 0
                ? unReadMessage.total_unread_count + unReadMessage.unread_post
                : null
          }}
        /> */}
        <Tab.Screen
          name="ChannelList"
          component={ChannelListScreenV2}
          initialParams={{isBottomTab: true}}
          options={{
            activeTintColor: colors.holytosca,
            tabBarIcon: renderTabLabelIcon('ChannelList'),
            tabBarBadge: totalUnreadCount > 0 ? totalUnreadCount : null
          }}
        />
        <Tab.Screen
          name="News"
          component={NewsScreen}
          initialParams={{isBottomTab: true}}
          options={{
            activeTintColor: colors.holytosca,
            tabBarIcon: renderTabLabelIcon('News')
            // unmountOnBlur: true
          }}
        />
        <Tab.Screen
          name="Profile"
          initialParams={{isBottomTab: true}}
          component={ProfileScreen}
          options={{
            activeTintColor: colors.holytosca,
            tabBarIcon: renderTabLabelIcon('Profile')
            // unmountOnBlur:true
          }}
        />
      </Tab.Navigator>
      <FirebaseConfig navigation={navigation} />
    </View>
  );
}

export default HomeBottomTabs;
const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%'
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
  }
});
