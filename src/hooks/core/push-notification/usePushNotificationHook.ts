import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';
import React, {useState} from 'react';
import {Platform} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {useRecoilState} from 'recoil';

import ChannelList from '../../../database/schema/ChannelListSchema';
import profileAtom from '../../../atom/profileAtom';
import useChatUtilsHook from '../chat/useChatUtilsHook';
import useLocalDatabaseHook from '../../../database/hooks/useLocalDatabaseHook';
import useUserAuthHook from '../auth/useUserAuthHook';
import TokenStorage, {ITokenEnum} from '../../../utils/storage/custom/tokenStorage';
import {getAnonymousUserId, getUserId} from '../../../utils/users';

const usePushNotificationHook = () => {
  const isIos = Platform.OS === 'ios';

  const navigation = useNavigation();
  const {signedProfileId, anonProfileId} = useUserAuthHook();
  const {localDb} = useLocalDatabaseHook();
  const {fetchChannelDetail, setSelectedChannel} = useChatUtilsHook();
  const [, setProfileAtom] = useRecoilState(profileAtom);

  const [isLoadingFetchingChannelDetail, setIsLoadingFetchingChannelDetail] = useState(false);

  const __createChannel = () => {
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

  const __pushNotifIos = (message) => {
    const {title, body} = message.notification;
    PushNotificationIOS.addNotificationRequest({
      title,
      body,
      id: message.messageId,
      userInfo: message.data
    });
  };

  const __pushNotifAndroid = (remoteMessage) => {
    const {title, body} = remoteMessage.notification;
    PushNotification.localNotification({
      id: '123',
      title,
      channelId: 'bettersosialid',
      message: body,
      data: remoteMessage.data
    });
  };

  const __handlePushNotif = (remoteMessage) => {
    const {data} = remoteMessage;
    if (data.channel_type !== 3) {
      if (isIos) {
        __pushNotifIos(remoteMessage);
      } else {
        __pushNotifAndroid(remoteMessage);
      }
    }
  };

  const __updateProfileAtomId = async () => {
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
  let isOpenNotification = false;

  const helperNavigationResetWithData = (screenData) => {
    setTimeout(() => {
      if (!isOpenNotification) {
        isOpenNotification = true;
        const routes = [
          {
            name: 'AuthenticatedStack',
            params: {
              screen: 'HomeTabs',
              params: {
                screen: 'SignedChannelList'
              }
            }
          }
        ];

        if (screenData)
          routes.push({
            name: 'AuthenticatedStack',
            params: {
              ...screenData
            }
          });

        navigation.reset({
          index: screenData ? 2 : 1,
          routes
        });
      }
    }, 500);
  };

  const __handleNotification = async (notification) => {
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
      if (notification?.data?.receiver_id === signedProfileId) {
        const channel = new ChannelList({
          id: notification?.data?.channel_id,
          channelType: 'PM'
        });
        setIsLoadingFetchingChannelDetail(true);
        try {
          await fetchChannelDetail(channel);
          const selectedChannel = await ChannelList.getSchemaById(
            localDb,
            notification?.data?.channel_id
          );
          setSelectedChannel(selectedChannel);
          helperNavigationResetWithData({
            screen: 'SignedChatScreen'
          });
        } catch (e) {
          console.log('error', e);
        } finally {
          setIsLoadingFetchingChannelDetail(false);
        }
      }
    }
  };

  React.useEffect(() => {
    __createChannel();
    __updateProfileAtomId();

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      __handlePushNotif(remoteMessage);
    });

    const unsubscribe = messaging().onMessage((remoteMessage) => {
      // eslint-disable-next-line no-unused-expressions
      __handlePushNotif(remoteMessage);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  React.useEffect(() => {
    PushNotification.configure({
      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification(notification) {
        __handleNotification(notification);
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

    return () => {
      PushNotification.unregister();
    };
  }, [navigation, signedProfileId, localDb]);

  return {
    isLoadingFetchingChannelDetail
  };
};

export default usePushNotificationHook;
