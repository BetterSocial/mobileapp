import PropTypes from 'prop-types';
import React from 'react';
import SimpleToast from 'react-native-simple-toast';
import dynamicLinks from '@react-native-firebase/dynamic-links';

import StringConstant from '../utils/string/StringConstant';
import {
  POST_CHECK_AUTHOR_BLOCKED,
  POST_CHECK_AUTHOR_NOT_FOLLOWING,
  POST_CHECK_FEED_EXPIRED,
  POST_CHECK_FEED_NOT_FOUND
} from '../utils/constants';
import {getUserId} from '../utils/users';
import {isAuthorFollowingMe} from '../service/post';

const FirebaseConfig = (props) => {
  const {navigation} = props;

  React.useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(parseDynamicLink);
    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    // dynamicLinks().getInitialLink().then(parseDynamicLink);
  }, []);

  /**
   *
   * @param {FirebaseDynamicLinksTypes.DynamicLink} dynamicLink
   */
  const parseDynamicLink = async (dynamicLink) => {
    console.log('called dynamic link', dynamicLink);
    if (dynamicLink?.url?.includes('postExpired=true')) return handleExpiredPost();
    if (dynamicLink?.url?.includes('postPrivateId=')) return handlePrivatePost(dynamicLink);
    if (dynamicLink?.url?.includes('communityName')) return handleCommunityPage(dynamicLink);
    if (dynamicLink?.url?.includes('users?username=')) return getUserProfile(dynamicLink?.url);
    return handlePost(dynamicLink);
  };

  const USER = 'users';
  const getUserProfile = async (url) => {
    if (url && typeof url === 'string') {
      const userId = await getUserId();
      const splitUser = url.split('/');
      let data = {};
      const params = splitUser[splitUser.length - 1];
      const splitParams = params.split('?');
      const type = splitParams[0];
      const splitting = splitParams[splitParams.length - 1].split('&');
      if (Array.isArray(splitting) && splitting.length > 0) {
        splitting.forEach((value) => {
          const mapSplit = value.split('=');
          data = {...data, [mapSplit[0]]: mapSplit[mapSplit.length - 1]};
        });
      }
      data = {...data, user_id: userId};
      handleMovePage(type, data);
    }
  };

  const handleCommunityPage = (data) => {
    const splitParam = data?.url?.split('=');
    let useParam = splitParam[1];
    useParam = useParam.split('');
    useParam = useParam.slice(0, useParam.length - 1).join('');

    navigation.navigate('TopicPageScreen', {id: useParam});
  };

  const handleMovePage = async (type, data) => {
    if (type === USER) {
      navigation.navigate('OtherProfile', {
        data
      });
    }
  };

  const handleExpiredPost = async () => {
    SimpleToast.show(StringConstant.dynamicLinkPostExpired, SimpleToast.SHORT);
    return navigation.navigate('Feed');
  };

  const checkIsAuthorFollowingMe = async (postId) => {
    const response = await isAuthorFollowingMe(postId);
    const isAuthorFollowing = response?.success;
    const errorCode = response?.code;

    if (!isAuthorFollowing && errorCode === POST_CHECK_FEED_NOT_FOUND) {
      SimpleToast.show(StringConstant.dynamicLinkPostCannotBeFound, SimpleToast.SHORT);
      return navigation.navigate('Feed');
    }

    if (!isAuthorFollowing && errorCode === POST_CHECK_AUTHOR_NOT_FOLLOWING) {
      SimpleToast.show(StringConstant.dynamicLinkAuthorNotFollowing, SimpleToast.SHORT);
      return navigation.navigate('Feed');
    }

    if (!isAuthorFollowing && errorCode === POST_CHECK_AUTHOR_BLOCKED) {
      SimpleToast.show(StringConstant.dynamicLinkAuthorBlocks, SimpleToast.SHORT);
      return navigation.navigate('Feed');
    }

    if (!isAuthorFollowing && errorCode === POST_CHECK_FEED_EXPIRED) {
      SimpleToast.show(StringConstant.dynamicLinkPostExpired, SimpleToast.SHORT);
      return navigation.navigate('Feed');
    }

    return navigation?.navigate('PostDetailPage', {
      feedId: postId,
      refreshCache: null,
      isCaching: false
    });
  };

  const handlePost = async (dynamicLink) => {
    let postId = dynamicLink?.url?.split('postId=')[1];
    postId = postId?.length > 36 ? postId.substring(0, 36) : postId;

    if (postId) checkIsAuthorFollowingMe(postId);
  };

  const handlePrivatePost = async (dynamicLink) => {
    const postId = dynamicLink?.url?.split('postPrivateId=')[1];
    if (postId) checkIsAuthorFollowingMe(postId);
  };

  return <></>;
};

FirebaseConfig.propTypes = {
  navigation: PropTypes.object
};

export default FirebaseConfig;
