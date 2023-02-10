import * as React from 'react';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';
import {Platform, StyleSheet, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useRecoilValue} from 'recoil';

import FirebaseConfig from '../configs/FirebaseConfig';
import UniversalLink from '../configs/UniversalLink';
import renderTabLabelIcon from '../components/BottomTab/TabLabelIcon';
import {ChannelListScreen, FeedScreen, NewsScreen, ProfileScreen} from '../screens';
import {Context} from '../context';
import {InitialStartupAtom, otherProfileAtom} from '../service/initialStartup';
import {colors} from '../utils/colors';

const Tab = createBottomTabNavigator();

function HomeBottomTabs({navigation}) {
  const isIos = Platform.OS === 'ios';

  const initialStartup = useRecoilValue(InitialStartupAtom);
  const otherProfileData = useRecoilValue(otherProfileAtom);
  const [unReadMessage] = React.useContext(Context).unReadMessage;

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
      sound: true
    },
    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,
    requestPermissions: true
  });

  const requestPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled && __DEV__) {
      console.log('Authorization status:', authStatus);
    }
  };

  const pushNotifIos = (message) => {
    if (__DEV__) {
      console.log(message.messageId, 'message');
    }
    PushNotificationIOS.addNotificationRequest({
      title: message.notification.title,
      body: message.notification.body,
      id: message.messageId
    });
  };

  const pushNotifAndroid = (remoteMessage) => {
    PushNotification.localNotification({
      id: '123',
      title: remoteMessage.notification.title,
      channelId: 'bettersosialid',
      message: remoteMessage.notification.body
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
    let {channel} = remoteMessage.data;
    channel = JSON.parse(channel);
    if (channel.channel_type !== 3) {
      if (isIos) {
        pushNotifIos(remoteMessage);
      } else {
        pushNotifAndroid(remoteMessage);
      }
    }
  };

  React.useEffect(() => {
    createChannel();
    requestPermission();

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

  // const renderTabLabelIcon =
  //   (componentType) =>
  //   // eslint-disable-next-line react/display-name
  //   ({color}) => {
  //     if (componentType === 'Feed') {
  //       return (
  //         <View style={styles.center}>
  //           <MemoFeed fill={color} />
  //         </View>
  //       );
  //     }
  //     if (componentType === 'ChannelList') {
  //       return (
  //         <View style={styles.center}>
  //           <MemoHome fill={color} />
  //         </View>
  //       );
  //     }
  //     if (componentType === 'News') {
  //       return (
  //         <View>
  //           <MemoNews fill={color} />
  //         </View>
  //       );
  //     }

  //     return (
  //       <View style={styles.center}>
  //         <MemoProfileIcon />
  //       </View>
  //     );
  //   };
  // // eslint-disable-next-line react/display-name

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
          options={{
            activeTintColor: colors.holytosca,
            tabBarIcon: renderTabLabelIcon('Feed')
            // unmountOnBlur: true
          }}
        />
        <Tab.Screen
          name="ChannelList"
          component={ChannelListScreen}
          options={{
            activeTintColor: colors.holytosca,
            tabBarIcon: renderTabLabelIcon('ChannelList'),
            tabBarBadge:
              unReadMessage.total_unread_count + unReadMessage.unread_post > 0
                ? unReadMessage.total_unread_count + unReadMessage.unread_post
                : null
          }}
        />
        <Tab.Screen
          name="News"
          component={NewsScreen}
          options={{
            activeTintColor: colors.holytosca,
            tabBarIcon: renderTabLabelIcon('News')
            // unmountOnBlur: true
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            activeTintColor: colors.holytosca,
            tabBarIcon: renderTabLabelIcon('Profile')
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
