import {OneSignal} from 'react-native-onesignal';

import {TopicRepoItem, getFollowingTopic} from '../topics';

const addCommunityTags = (communities: string[] = []) => {
  if (!communities) return;
  try {
    const communityString = communities?.join(',');
    console.log('adding community tag', communityString);
    OneSignal.User.addTag('better_community', communityString);
  } catch (e) {
    console.log('error adding community tag', e);
  }
};

const rebuildCommunityTags = async () => {
  const response = await getFollowingTopic();
  const communities = response?.data as TopicRepoItem[];
  const communityNames = communities?.map((item) => item?.name);
  addCommunityTags(communityNames);
};

const login = async (userId) => {
  OneSignal.login(userId);
};

const OneSignalUtil = {
  addCommunityTags,
  rebuildCommunityTags,
  login
};

export default OneSignalUtil;
