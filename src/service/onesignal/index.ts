import {OneSignal} from 'react-native-onesignal';

import {getSubscribeableTopic} from '../topics';

type TopicTag = {
  name: string;
};

const rebuildAndSubscribeTags = async () => {
  try {
    const response = await getSubscribeableTopic();
    const {topics = [], histories = []} = response?.data || {};

    histories?.map((history: TopicTag) => {
      OneSignal.User.removeTag(`better_community_${history?.name}`);
      return null;
    });

    topics?.map((topic: TopicTag) => {
      OneSignal.User.addTag(`better_community_${topic?.name}`, 'true');
      return null;
    });
  } catch (e) {
    console.log('error rebuilding and subscribing tags', e);
  }
};

const login = async (userId) => {
  OneSignal.login(userId);
};

const OneSignalUtil = {
  rebuildAndSubscribeTags,
  login
};

export default OneSignalUtil;
