import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';
import React, {useState} from 'react';
import {Platform} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {useRecoilState} from 'recoil';

import ChannelList from '../../../database/schema/ChannelListSchema';
import ChatSchema from '../../../database/schema/ChatSchema';
import profileAtom from '../../../atom/profileAtom';
import useAppBadgeHook from '../../appBadge/useAppBadgeHook';
import useChatUtilsHook from '../chat/useChatUtilsHook';
import useLocalDatabaseHook from '../../../database/hooks/useLocalDatabaseHook';
import useUserAuthHook from '../auth/useUserAuthHook';
import TokenStorage, {ITokenEnum} from '../../../utils/storage/custom/tokenStorage';
import {getAnonymousUserId, getUserId} from '../../../utils/users';
import {getMessageDetail} from '../../../service/repo/messageRepo';

const usePushNotificationHook = () => {
  const isIos = Platform.OS === 'ios';

  const navigation = useNavigation();
  const {signedProfileId} = useUserAuthHook();
  const {localDb} = useLocalDatabaseHook();
  const {fetchChannelDetail, setSelectedChannel} = useChatUtilsHook();
  const {updateAppBadgeFromDB} = useAppBadgeHook();

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

        if (screenData) {
          routes.push({
            name: 'AuthenticatedStack',
            params: {
              ...screenData
            }
          });
        }

        navigation.reset({
          index: screenData ? 2 : 1,
          routes
        });
      }
    }, 500);
  };

  const __handleNotification = async (notification) => {
    if (notification?.data?.type === 'topic' && notification?.data?.topic_name) {
      navigation.navigate('TopicPageScreen', {
        id: notification?.data?.topic_name
      });
    }

    if (notification?.data?.type === 'feed' || notification?.data?.type === 'reaction') {
      navigation.navigate('PostDetailPage', {
        feedId: notification.data.feed_id,
        is_from_pn: true
      });
    }
    if (notification?.data?.type === 'follow_user') {
      navigation.navigate('OtherProfile', {
        data: {
          user_id: notification?.data?.user_id,
          other_id: notification?.data?.user_id_follower,
          username: notification?.data?.username_follower
        }
      });
    }
    if (notification?.data?.type === 'message.new') {
      if (notification?.userInteraction) {
        const selectedChannel = await ChannelList.getSchemaById(
          localDb,
          notification?.data?.channel_id
        );
        setSelectedChannel(selectedChannel);
        if (notification?.data?.is_annoymous === 'false') {
          helperNavigationResetWithData({
            screen: 'SignedChatScreen'
          });
        } else {
          helperNavigationResetWithData({
            screen: 'AnonymousChatScreen'
          });
        }
      }
    }
  };

  React.useEffect(() => {
    __createChannel();
    __updateProfileAtomId();
    if (localDb) {
      messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        const response = await ChannelList.getById(
          localDb,
          remoteMessage.data?.channel_id as string
        );
        if (!response?.id) {
          const channel = new ChannelList({
            // craete channel payload
            id: remoteMessage.data?.channel_id,
            channelType: 'PM'
          });
          await fetchChannelDetail(channel); // insert channel detail
        }
        if (remoteMessage.data?.is_big_message === 'true') {
          // todo: fetch message detail by message id
          // todo: insert message to sqlite
          const {message: messageRes} = await getMessageDetail(
            remoteMessage.data?.messages_id as string
          );
          const {message} = messageRes;
          const chatSchema = new ChatSchema({
            id: message.id,
            channelId: message.channel.id,
            userId: message.user.id,
            message: message.text,
            type: message.type,
            createdAt: message.created_at,
            updatedAt: message.created_at,
            rawJson: {},
            attachmentJson: message.attachment,
            user: message.user,
            status: 'sent',
            isMe: false,
            isContinuous: false
          });
          await chatSchema.save(localDb);
        } else {
          const chatSchema = new ChatSchema({
            id: remoteMessage.data?.messages_id,
            channelId: remoteMessage.data?.channel_id,
            userId: remoteMessage.data?.user_id,
            message: remoteMessage.data?.message,
            type: remoteMessage.data?.type,
            createdAt: remoteMessage.data?.created_at,
            updatedAt: remoteMessage.data?.created_at,
            rawJson: {},
            attachmentJson: remoteMessage.data?.attachment,
            user: null,
            status: remoteMessage.data?.status,
            isMe: false,
            isContinuous: false
          });
          await chatSchema.save(localDb);
        }

        updateAppBadgeFromDB(localDb);
      });

      const unsubscribes = messaging().onMessage(async (remoteMessage) => {
        __handlePushNotif(remoteMessage);
      });

      return () => {
        unsubscribes();
      };
    }
  }, [localDb]);

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
