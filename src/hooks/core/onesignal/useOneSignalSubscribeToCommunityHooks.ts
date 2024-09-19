import {OneSignal} from 'react-native-onesignal';
import {useEffect} from 'react';
import {useNavigation} from '@react-navigation/core';

import OneSignalUtil from '../../../service/onesignal';
import useUserAuthHook from '../auth/useUserAuthHook';
import AnalyticsEventTracking, {
  BetterSocialEventTracking
} from '../../../libraries/analytics/analyticsEventTracking';
import getFeatureLoggerInstance, {EFeatureLogFlag} from '../../../utils/log/FeatureLog';
import {ONESIGNAL_PN_TYPE} from '../../../utils/constants';
import {OneSignalNotificationData} from './types.d';

const {featLog} = getFeatureLoggerInstance(EFeatureLogFlag.useOneSignalSubscribeToCommunityHooks);

export type HomeTabsScreen = 'SignedChannelList' | 'AnonymousChannelList' | 'Feed' | 'Profile';
export type ScreenData = {
  screen: string;
  params?: any;
};

const useOneSignalSubscribeToCommunityHooks = () => {
  const navigation = useNavigation();
  const {token, signedProfileId} = useUserAuthHook();

  const baseResetNavigation = (tabsScreenName: HomeTabsScreen, screen: ScreenData) => {
    setTimeout(() => {
      const routes = [
        {
          name: 'AuthenticatedStack',
          params: {
            screen: 'HomeTabs',
            params: {
              screen: tabsScreenName
            }
          }
        },
        {
          name: 'AuthenticatedStack',
          params: {
            ...screen
          }
        }
      ];

      navigation.reset({
        index: screen?.screen ? 2 : 1,
        routes
      });
    }, 500);
  };

  const loginToOneSignal = async () => {
    featLog('login to one signal', token, signedProfileId);
    try {
      const oneSignalExternalId = await OneSignal.User.getExternalId();
      if (!oneSignalExternalId) return;

      await OneSignalUtil.rebuildAndSubscribeTags();
    } catch (e) {
      console.log('error one signal login ');
      console.log(e);
    }
  };

  const addNotificationListener = async () => {
    OneSignal.Notifications.addEventListener('click', (event) => {
      const additionalData = event?.notification?.additionalData as OneSignalNotificationData;

      if (additionalData?.community) {
        AnalyticsEventTracking.eventTrack(
          `${BetterSocialEventTracking.ONE_SIGNAL_PUSH_NOTIFICATIONS}${
            additionalData?.campaign || 'topic'
          }`
        );
        baseResetNavigation('Feed', {
          screen: 'TopicPageScreen',
          params: {
            id: additionalData?.community,
            is_from_pn: true
          }
        });

        return;
      }

      // This block is for handling notification from one signal
      if (additionalData?.type === ONESIGNAL_PN_TYPE.PDP) {
        AnalyticsEventTracking.eventTrack(
          `${BetterSocialEventTracking.ONE_SIGNAL_PUSH_NOTIFICATIONS}${additionalData?.campaign}`
        );

        baseResetNavigation('Feed', {
          screen: 'PostDetailPage',
          params: {
            feedId: additionalData?.feed_id
          }
        });

        return;
      }

      if (additionalData?.type === ONESIGNAL_PN_TYPE.TOPIC) {
        AnalyticsEventTracking.eventTrack(
          `${BetterSocialEventTracking.ONE_SIGNAL_PUSH_NOTIFICATIONS}${additionalData?.campaign}`
        );
        baseResetNavigation('Feed', {
          screen: 'TopicPageScreen',
          params: {
            id: additionalData?.community,
            is_from_pn: true
          }
        });

        return;
      }

      if (additionalData.type === ONESIGNAL_PN_TYPE.PROFILE) {
        AnalyticsEventTracking.eventTrack(
          `${BetterSocialEventTracking.ONE_SIGNAL_PUSH_NOTIFICATIONS}${additionalData?.campaign}`
        );
        baseResetNavigation('Feed', {
          screen: 'OtherProfile',
          params: {
            data: {
              user_id: signedProfileId,
              username: additionalData?.username,
              is_from_pn: true
            }
          }
        });
      }
      // Onesignal block end
    });
  };

  useEffect(() => {
    if (token && signedProfileId) {
      loginToOneSignal();
      addNotificationListener();
    }
  }, [token, signedProfileId]);
};

export default useOneSignalSubscribeToCommunityHooks;
