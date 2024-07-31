import PropTypes from 'prop-types';
import React from 'react';
import SimpleToast from 'react-native-simple-toast';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {Alert, Linking} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import StringConstant from '../utils/string/StringConstant';
import useUserAuthHook from '../hooks/core/auth/useUserAuthHook';
import {
  POST_CHECK_AUTHOR_BLOCKED,
  POST_CHECK_AUTHOR_NOT_FOLLOWING,
  POST_CHECK_FEED_EXPIRED,
  POST_CHECK_FEED_NOT_FOUND
} from '../utils/constants';
import {getUserId} from '../utils/users';
import {isAuthorFollowingMe} from '../service/post';

const DEEPLINK_POST_REGEX = /helio\.social\/post\/[0-9a-fA-F\-]{36}/;
const DEEPLINK_COMMUNITY_REGEX = /helio\.social\/c\/[a-zA-Z0-9]+/;
const DEEPLINK_USER_REGEX = /helio\.social\/[a-zA-Z0-9]+/;

const FirebaseConfig = () => {
  const navigation = useNavigation();
  const {signedProfileId, profile} = useUserAuthHook();

  React.useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(parseDynamicLink);
    const onForegroundEvent = async (event) => {
      parseDeepLink(event?.url);
    };

    Linking.addEventListener('url', onForegroundEvent);
    return () => {
      unsubscribe();
      Linking.removeEventListener('url', onForegroundEvent);
    };
  }, []);

  const parseDeepLink = async (deepLinkUrl) => {
    if (DEEPLINK_POST_REGEX.test(deepLinkUrl)) return handleDeepLinkPost(deepLinkUrl);
    if (DEEPLINK_COMMUNITY_REGEX.test(deepLinkUrl)) return handleDeepLinkCommunity(deepLinkUrl);
    if (DEEPLINK_USER_REGEX.test(deepLinkUrl)) return handleDeepLinkUser(deepLinkUrl);
  };

  /**
   *
   * @param {FirebaseDynamicLinksTypes.DynamicLink} dynamicLink
   */
  const parseDynamicLink = async (dynamicLink) => {
    setTimeout(() => {
      Alert.alert('Dynamic Link from dynamicLink', dynamicLink?.url);
    }, 1000);
    if (dynamicLink?.url?.includes('postExpired=true')) return handleExpiredPost();
    if (dynamicLink?.url?.includes('postPrivateId=')) return handlePrivatePost(dynamicLink);
    if (dynamicLink?.url?.includes('communityName')) return handleCommunityPage(dynamicLink);
    if (dynamicLink?.url?.includes('users?username=')) return getUserProfile(dynamicLink?.url);
    if (dynamicLink?.url?.includes('?username=')) return getUserProfileV3(dynamicLink?.url);
    if (dynamicLink?.url?.includes('profile/')) return getUserProfileV2(dynamicLink?.url);
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

  const getUserProfileV2 = async (url) => {
    if (url && typeof url === 'string') {
      const userId = await getUserId();
      const parts = url.split('/profile/');
      const urlSplit = parts?.[1];
      const paramSplit = urlSplit?.split('?userId=');
      const username = paramSplit?.[0];
      const targetUserId = paramSplit?.[1];
      const data = {
        other_id: targetUserId,
        username,
        user_id: userId
      };
      handleMovePage(USER, data);
    }
  };

  const getUserProfileV3 = async (url) => {
    if (url && typeof url === 'string') {
      const userId = await getUserId();
      const parts = url.split('?username=');
      const username = parts?.[1];

      try {
        const replacedUsername = username?.replace('+', '');
        const data = {
          username: replacedUsername,
          user_id: userId
        };
        handleMovePage(USER, data);
      } catch (e) {
        console.error(e);
      }
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

  const handleDeepLinkPost = async (deepLinkUrl) => {
    const postId = deepLinkUrl?.split('helio.social/post/')[1];
    if (DEEPLINK_POST_REGEX.test(deepLinkUrl) && postId) checkIsAuthorFollowingMe(postId);
  };

  const handleDeepLinkUser = async (deepLinkUrl) => {
    const username = deepLinkUrl?.split('helio.social/')[1];
    if (username?.toLocaleLowerCase() === profile?.username?.toLocaleLowerCase()) {
      return navigation.navigate('Profile');
    }

    if (DEEPLINK_USER_REGEX.test(deepLinkUrl) && username) {
      try {
        const replacedUsername = username?.replace('+', '');
        const data = {
          username: replacedUsername,
          user_id: signedProfileId
        };
        handleMovePage(USER, data);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleDeepLinkCommunity = async (deepLinkUrl) => {
    const communityName = deepLinkUrl?.split('helio.social/c/')[1];
    if (DEEPLINK_COMMUNITY_REGEX.test(deepLinkUrl) && communityName) {
      try {
        navigation.navigate('TopicPageScreen', {id: communityName});
      } catch (e) {
        console.error(e);
      }
    }
  };

  return <></>;
};

FirebaseConfig.propTypes = {
  navigation: PropTypes.object
};

export default FirebaseConfig;
