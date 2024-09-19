import * as React from 'react';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import {Alert, PushNotificationPermissions} from 'react-native';
import {OneSignal} from 'react-native-onesignal';
import {openSettings} from 'react-native-permissions';

import ChannelList from '../../database/schema/ChannelListSchema';
import OneSignalUtil from '../../service/onesignal';
import StorageUtils from '../../utils/storage';
import useLocalDatabaseHook from '../../database/hooks/useLocalDatabaseHook';
import useUserAuthHook from '../core/auth/useUserAuthHook';
import {
  PERMISSION_STATUS_ACCEPTED,
  PERMISSION_STATUS_BLOCKED,
  PERMISSION_STATUS_NOT_DEFINED,
  PERMISSION_STATUS_PENDING
} from '../../utils/constants';
import {fcmTokenService} from '../../service/users';

const useRootChannelListHook = () => {
  const {localDb, chat, channelList} = useLocalDatabaseHook();
  const [signedChannelUnreadCount, setSignedChannelUnreadCount] = React.useState(0);
  const [anonymousChannelUnreadCount, setAnonymousChannelUnreadCount] = React.useState(0);
  const [totalUnreadCount, setTotalUnreadCount] = React.useState(0);

  const {signedProfileId} = useUserAuthHook();

  const getSignedChannelUnreadCount = async () => {
    if (!localDb) return;
    try {
      const unreadCount = await ChannelList.getUnreadCount(localDb, 'SIGNED');
      setSignedChannelUnreadCount(unreadCount);
    } catch (e) {
      console.log(e);
    }
  };

  const getAnonymousChannelUnreadCount = async () => {
    if (!localDb) return;
    try {
      const unreadCount = await ChannelList.getUnreadCount(localDb, 'ANON');
      setAnonymousChannelUnreadCount(unreadCount);
    } catch (e) {
      console.log(e);
    }
  };

  const requestPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      const fcmToken = await messaging().getToken();
      const payload = {
        fcm_token: fcmToken
      };
      fcmTokenService(payload);
      OneSignal.User.pushSubscription.optIn();
      if (signedProfileId) {
        const externalId = await OneSignalUtil.setExternalId(signedProfileId);
        if (externalId)
          setTimeout(() => {
            OneSignalUtil.rebuildAndSubscribeTags();
          }, 1000);
      }
    }
  };

  const checkNotificationPermission = async () => {
    PushNotification.checkPermissions(
      (
        data: PushNotificationPermissions & {
          authorizationStatus?: number;
        }
      ) => {
        const lastPromptTime = StorageUtils.lastPromptNotification.get();
        const promptInterval = 48 * 60 * 60 * 1000;
        const currentTime = new Date().getTime();
        if (lastPromptTime && currentTime - parseFloat(lastPromptTime) < promptInterval) {
          return; // Don't show the prompt if the interval has not passed
        }

        const needsPermission =
          data.alert === false || data.badge === false || data.sound === false;

        const showAlert = (onPressAction: () => void) =>
          Alert.alert(
            "Don't Miss New Messages",
            `Allow notifications to know 
when friends send you messages.`,
            [
              {text: 'Not now', onPress: () => console.log('Cancel Pressed')},
              {text: 'Allow', onPress: onPressAction, isPreferred: true}
            ]
          );

        switch (data.authorizationStatus) {
          case PERMISSION_STATUS_ACCEPTED:
            if (needsPermission) {
              // THIS CASE IT'S TRIGGERED WHEN USER MANUALLY DISABLED THE NOTIFICATION
              StorageUtils.lastPromptNotification.set(currentTime.toString());
              showAlert(() => openSettings().catch(() => console.warn('cannot open settings')));
            } else {
              requestPermission();
            }
            break;
          case PERMISSION_STATUS_BLOCKED:
            if (needsPermission) {
              StorageUtils.lastPromptNotification.set(currentTime.toString());
              showAlert(() => openSettings().catch(() => console.warn('cannot open settings')));
            }
            break;
          case PERMISSION_STATUS_PENDING:
          case PERMISSION_STATUS_NOT_DEFINED:
            StorageUtils.lastPromptNotification.set(currentTime.toString());
            showAlert(() => requestPermission());
            break;
          default:
            break;
        }
      }
    );
  };

  React.useEffect(() => {
    getSignedChannelUnreadCount().catch((e) => console.log(e));
    getAnonymousChannelUnreadCount().catch((e) => console.log(e));
  }, [localDb, chat, channelList]);

  React.useEffect(() => {
    setTotalUnreadCount(signedChannelUnreadCount + anonymousChannelUnreadCount);
  }, [signedChannelUnreadCount, anonymousChannelUnreadCount]);

  return {
    checkNotificationPermission,
    signedChannelUnreadCount,
    anonymousChannelUnreadCount,
    totalUnreadCount
  };
};

export default useRootChannelListHook;
