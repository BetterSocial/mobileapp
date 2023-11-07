import * as React from 'react';
import {atom, useRecoilValue, useSetRecoilState} from 'recoil';

import ChannelList from '../../database/schema/ChannelListSchema';
import ChannelListMemberSchema from '../../database/schema/ChannelListMemberSchema';
import ChatSchema from '../../database/schema/ChatSchema';
import DiscoveryAction from '../../context/actions/discoveryAction';
import TokenStorage from '../../utils/storage/custom/tokenStorage';
import TopicPageStorage from '../../utils/storage/custom/topicPageStorage';
import UserSchema from '../../database/schema/UserSchema';
import useLocalDatabaseHook from '../../database/hooks/useLocalDatabaseHook';
import useUserAuthHook from '../core/auth/useUserAuthHook';
import {Context} from '../../context';
import {resetAllNews} from '../../context/actions/news';
import {setMyProfileResetAll} from '../../context/actions/setMyProfileAction';

const resetAtom = atom({
  key: 'resetAtom',
  default: 0
});

const useResetContext = () => {
  const [, discoveryDispatch] = React.useContext(Context).discovery;
  const [, newsDispatch] = React.useContext(Context).news;
  const [, profileDispatch] = React.useContext(Context).profile;
  const {localDb} = useLocalDatabaseHook();

  const setRefreshCount = useSetRecoilState(resetAtom);
  const refreshCount = useRecoilValue(resetAtom);

  const {resetAuth} = useUserAuthHook();

  const resetAllContext = () => {
    setRefreshCount(new Date().getTime());
    DiscoveryAction.resetAllDiscovery(discoveryDispatch);
    resetAllNews(newsDispatch);
    setMyProfileResetAll(profileDispatch);
    resetAuth();
  };

  const resetLocalDB = () => {
    UserSchema.clearAll(localDb);
    ChatSchema.clearAll(localDb);
    ChannelListMemberSchema.clearAll(localDb);
    ChannelList.clearAll(localDb);

    TokenStorage.clear();
    TopicPageStorage.clear();
  };

  return {
    resetAllContext,
    resetLocalDB,
    refreshCount
  };
};

export default useResetContext;
