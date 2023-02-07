import PropTypes from 'prop-types';
import React from 'react';
import SimpleToast from 'react-native-simple-toast';
import dynamicLinks from '@react-native-firebase/dynamic-links';

import {getUserId} from '../utils/users';
import {isAuthorFollowingMe} from '../service/post';

const FirebaseConfig = (props) => {
  const {navigation} = props;

  React.useEffect(() => {
    handleBgDynamicLink();
    handleFgDynamicLink();
  });

  React.useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(parseDynamicLink);
    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    dynamicLinks().getInitialLink().then(parseDynamicLink);
  }, []);

  /**
   *
   * @param {FirebaseDynamicLinksTypes.DynamicLink} dynamicLink
   */
  const parseDynamicLink = async (dynamicLink) => {
    if (dynamicLink?.url?.includes('postExpired=true')) return handleExpiredPost(dynamicLink);
    if (dynamicLink?.url?.includes('postPrivateId=')) return handlePrivatePost(dynamicLink);
    if (dynamicLink?.url?.includes('postId=')) return handlePost(dynamicLink);
    return null;
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

  const handleMovePage = async (type, data) => {
    if (type === USER) {
      navigation.navigate('OtherProfile', {
        data
      });
    }
  };

  const handleBgDynamicLink = () => {
    dynamicLinks()
      .getInitialLink()
      .then((data) => {
        if (data) {
          getUserProfile(data.url);
        }
      });
  };

  const handleFgDynamicLink = () => {
    dynamicLinks().onLink((link) => {
      if (link) {
        getUserProfile(link.url);
      }
    });
  };

  const handleExpiredPost = async () => {
    SimpleToast.show('This post has expired and has been deleted automatically', SimpleToast.SHORT);
    return navigation.navigate('Feed');
  };

  const handlePost = async (dynamicLink) => {
    let postId = dynamicLink.url.split('postId=')[1];
    postId = postId?.length > 36 ? postId.substring(0, 36) : postId;
    return navigation?.navigate('PostDetailPage', {
      feedId: postId,
      refreshCache: null,
      isCaching: false
    });
  };

  const handlePrivatePost = async (dynamicLink) => {
    const postId = dynamicLink.url.split('postPrivateId=')[1];

    const response = await isAuthorFollowingMe(postId);
    const isAuthorFollowing = response?.success;
    const errorCode = response?.code;

    if (!isAuthorFollowing && errorCode === 1) {
      SimpleToast.show('Post is not found', SimpleToast.SHORT);
      return navigation.navigate('Feed');
    }

    if (!isAuthorFollowing && errorCode === 2) {
      SimpleToast.show('You cannot access this private post', SimpleToast.SHORT);
      return navigation.navigate('Feed');
    }

    if (!isAuthorFollowing && errorCode === 3) {
      SimpleToast.show(
        'This post has expired and has been deleted automatically',
        SimpleToast.SHORT
      );
      return navigation.navigate('Feed');
    }

    return navigation?.navigate('PostDetailPage', {
      feedId: postId,
      refreshCache: null,
      isCaching: false
    });
  };

  return <></>;
};

FirebaseConfig.propTypes = {
  navigation: PropTypes.object
};

export default FirebaseConfig;
