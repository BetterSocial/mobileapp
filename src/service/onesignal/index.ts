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

    topics?.map((topic: TopicTag) => {
      OneSignal.User.addTag(`better_community_${topic?.name}`, 'true');
      return null;
    });
  } catch (e) {
    console.log('error rebuilding and subscribing tags ', e?.message);
  }
};

const OneSignalUtil = {
  rebuildAndSubscribeTags
};

export default OneSignalUtil;
