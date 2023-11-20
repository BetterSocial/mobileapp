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
      history?.forEach((historyItem: TopicTag) => {
        OneSignal.User.removeTag(`better_community_${historyItem?.name}`);
        Monitoring.logActions('remove tag', `better_community_${historyItem?.name}`);
      });

      setTimeout(() => {
        topics?.forEach((topic: TopicTag) => {
          OneSignal.User.addTag(`better_community_${topic?.name}`, 'true');
          Monitoring.logActions('add tag', `better_community_${topic?.name}`);
        });

        resolve(null);
      }, SET_TAG_TIMEOUT);
    });
  } catch (e) {
    console.log('error rebuilding and subscribing tags ', e?.message);
    Monitoring.logError('error rebuilding and subscribing tags ', e);
    return null;
  }
};

const removeAllSubscribedTags = async () => {
  try {
    const response = await getSubscribeableTopic();
    const {history = []} = response?.data || {};

    history?.forEach((topic: TopicTag) => {
      OneSignal.User.removeTag(`better_community_${topic?.name}`);
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
