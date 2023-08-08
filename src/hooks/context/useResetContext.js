import * as React from 'react';
import {atom, useRecoilValue, useSetRecoilState} from 'recoil';

import DiscoveryAction from '../../context/actions/discoveryAction';
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

  const setRefreshCount = useSetRecoilState(resetAtom);
  const refreshCount = useRecoilValue(resetAtom);

  const resetAllContext = () => {
    setRefreshCount(new Date().getTime());
    DiscoveryAction.resetAllDiscovery(discoveryDispatch);
    resetAllNews(newsDispatch);
    setMyProfileResetAll(profileDispatch);
  };

  return {
    resetAllContext,
    refreshCount
  };
};

export default useResetContext;
