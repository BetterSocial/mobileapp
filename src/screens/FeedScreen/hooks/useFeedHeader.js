/* eslint-disable camelcase */
import React from 'react';
import SimpleToast from 'react-native-simple-toast';
import {useNavigation} from '@react-navigation/core';

import {Context} from '../../../context';
import {SOURCE_FEED_TAB, SOURCE_MY_PROFILE, SOURCE_PDP} from '../../../utils/constants';
import {getUserId} from '../../../utils/users';
import {setTimer} from '../../../context/actions/feeds';
import {viewTimePost} from '../../../service/post';

const useFeedHeader = ({actor, source}) => {
  const navigation = useNavigation();
  const [feedsContext, dispatch] = React.useContext(Context).feeds;
  const {feeds, timer, viewPostTimeIndex} = feedsContext;

  const userId = actor?.id;
  const {username, profile_pic_url} = actor?.data || {};

  const resetTimer = () => {
    console.log('reset timer called');
    setTimer(new Date(), dispatch);
  };

  const sendViewTimePost = (id) => {
    const currentTime = new Date().getTime();
    const sourceParam = source === SOURCE_PDP ? SOURCE_FEED_TAB : source;
    viewTimePost(id, currentTime - timer.getTime(), sourceParam)
      .then(resetTimer)
      .catch((e) => {
        console.log(e);
      });
  };

  const handleNavigate = (selfUserId) => {
    if (source === SOURCE_MY_PROFILE) return;
    if (!actor?.data) {
      SimpleToast.show('Account has been deleted', SimpleToast.SHORT);
      return;
    }

    if (selfUserId === userId) {
      navigation.navigate('ProfileScreen', {
        isNotFromHomeTab: true
      });

      return;
    }

    navigation.navigate('OtherProfile', {
      data: {
        user_id: selfUserId,
        other_id: userId,
        username
      }
    });
  };

  const navigateToProfile = async () => {
    const id = feeds && feeds[viewPostTimeIndex]?.id;
    if (source && id) {
      sendViewTimePost(id);
    }

    resetTimer();
    const selfUserId = await getUserId();
    handleNavigate(selfUserId);
  };

  const onBackNormalUser = () => {
    if (source) {
      const id = feeds && feeds[viewPostTimeIndex]?.id;
      sendViewTimePost(id);
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
