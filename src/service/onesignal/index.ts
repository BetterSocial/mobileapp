import {OneSignal} from 'react-native-onesignal';

import getFeatureLoggerInstance, {EFeatureLogFlag} from '../../utils/log/FeatureLog';
import {Monitoring} from '../../libraries/monitoring/sentry';
import {getSubscribeableTopic} from '../topics';

type TopicTag = {
  name: string;
};

const {featLog} = getFeatureLoggerInstance(EFeatureLogFlag.oneSignalUtils);
const SET_TAG_TIMEOUT = 10 * 1000;

const rebuildAndSubscribeTags = async () => {
  try {
    const response = await getSubscribeableTopic();
    const {topics = [], history = []} = response?.data || {};

    return new Promise((resolve) => {
      history?.map((historyItem: TopicTag) => {
        Monitoring.logActions('remove tag', `better_community_${historyItem?.name}`);
        OneSignal.User.removeTag(`better_community_${historyItem?.name}`);
        return null;
      });

      setTimeout(() => {
        topics?.map((topic: TopicTag) => {
          Monitoring.logActions('add tag', `better_community_${topic?.name}`);
          OneSignal.User.addTag(`better_community_${topic?.name}`, 'true');
          return null;
        });

        resolve(null);
      }, 2000);
    });
  } catch (e) {
    console.log('error rebuilding and subscribing tags ', e?.message);
    Monitoring.logError('error rebuilding and subscribing tags ', e?.message);
    return null;
  }
};

const removeAllSubscribedTags = async () => {
  try {
    const response = await getSubscribeableTopic();
    const {history = []} = response?.data || {};

    history?.map((topic: TopicTag) => {
      OneSignal.User.removeTag(`better_community_${topic?.name}`);
      return null;
    });
  } catch (e) {
    console.log('error removing all subscribed tags ', e?.message);
  }
};

const setExternalId = (userId: string) => {
  featLog('set external id', userId);
  OneSignal.login(userId);
};

const removeExternalId = () => {
  featLog('remove external id');
  OneSignal.logout();
};

const OneSignalUtil = {
  rebuildAndSubscribeTags,
  removeAllSubscribedTags,
  setExternalId,
  removeExternalId
};

export default OneSignalUtil;
