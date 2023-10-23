import {OneSignal} from 'react-native-onesignal';

import {getSubscribeableTopic} from '../topics';

type TopicTag = {
  name: string;
};

const rebuildAndSubscribeTags = async () => {
  try {
    const response = await getSubscribeableTopic();
    const {topics = [], history = []} = response?.data || {};

    history?.map((historyItem: TopicTag) => {
      OneSignal.User.removeTag(`better_community_${historyItem?.name}`);
      return null;
    });

    return new Promise((resolve) => {
      setTimeout(() => {
        topics?.map((topic: TopicTag) => {
          OneSignal.User.addTag(`better_community_${topic?.name}`, 'true');
          return null;
        });

        resolve(null);
      }, 2000);
    });
  } catch (e) {
    console.log('error rebuilding and subscribing tags ', e?.message);
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

const OneSignalUtil = {
  rebuildAndSubscribeTags,
  removeAllSubscribedTags
};

export default OneSignalUtil;
