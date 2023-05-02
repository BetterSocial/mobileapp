/* eslint-disable camelcase */
import React from 'react';
import SimpleToast from 'react-native-simple-toast';
import {useNavigation} from '@react-navigation/core';

import {Context} from '../../../context';
import {SOURCE_FEED_TAB, SOURCE_PDP} from '../../../utils/constants';
import {getUserId} from '../../../utils/token';
import {setTimer} from '../../../context/actions/feeds';
import {viewTimePost} from '../../../service/post';

const useFeedHeader = ({
  actor,

  source
}) => {
  const navigation = useNavigation();
  const [feedsContext, dispatch] = React.useContext(Context).feeds;
  const {feeds, timer, viewPostTimeIndex} = feedsContext;

  const userId = actor?.data?.human_id;
  const {username, profile_pic_url} = actor?.data || {};

  const handleNavigate = (selfUserId) => {
    if (selfUserId === userId) {
      return navigation.navigate('ProfileScreen', {
        isNotFromHomeTab: true
      });
    }

    if (!userId) return SimpleToast.show('Account has been deleted', SimpleToast.SHORT);

    return navigation.navigate('OtherProfile', {
      data: {
        user_id: selfUserId,
        other_id: userId,
        username
      }
    });
  };

  const navigateToProfile = async () => {
    if (source) {
      const currentTime = new Date().getTime();
      const id = feeds && feeds[viewPostTimeIndex]?.id;
      if (id) viewTimePost(id, currentTime - timer.getTime(), source);
      setTimer(new Date(), dispatch);
    }
    const selfUserId = await getUserId();
    handleNavigate(selfUserId);
  };

  const onBackNormalUser = () => {
    if (source) {
      const currentTime = new Date().getTime();
      const id = feeds && feeds[viewPostTimeIndex]?.id;
      if (id) viewTimePost(id, currentTime - timer.getTime(), source);
      if (id && source === SOURCE_PDP)
        viewTimePost(id, currentTime - timer.getTime(), SOURCE_FEED_TAB);
      setTimer(new Date(), dispatch);
    }

    navigation.goBack();
  };

  return {
    navigateToProfile,
    username,
    feeds,
    timer,
    viewPostTimeIndex,
    navigation,
    userId,
    profile_pic_url,
    dispatch,
    onBackNormalUser,
    handleNavigate
  };
};

export default useFeedHeader;
