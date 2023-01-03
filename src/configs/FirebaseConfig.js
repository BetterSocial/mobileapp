/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import PropTypes from 'prop-types';
import React from 'react'
import SimpleToast from 'react-native-simple-toast'
import dynamicLinks from '@react-native-firebase/dynamic-links';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

import StringConstant from '../utils/string/StringConstant';
import { POST_CHECK_AUTHOR_BLOCKED, POST_CHECK_AUTHOR_NOT_FOLLOWING, POST_CHECK_FEED_EXPIRED, POST_CHECK_FEED_NOT_FOUND } from '../utils/constants';
import { getUserId } from '../utils/users';
import { isAuthorFollowingMe } from '../service/post';

const FirebaseConfig = (props) => {
    const { navigation } = props

    React.useEffect(() => {
        handleBgDynamicLink()
        handleFgDynamicLink()
    })

    React.useEffect(() => {
        const unsubscribe = dynamicLinks().onLink(parseDynamicLink)
        return () => unsubscribe()
    }, [])

    React.useEffect(() => {
        dynamicLinks().getInitialLink().then(parseDynamicLink)
    }, [])

    /**
     * 
     * @param {FirebaseDynamicLinksTypes.DynamicLink} dynamicLink 
     */
    const parseDynamicLink = async (dynamicLink) => {
        if (dynamicLink?.url?.includes('postExpired=true')) return handleExpiredPost(dynamicLink)
        if (dynamicLink?.url?.includes('postPrivateId=')) return handlePrivatePost(dynamicLink)
        if (dynamicLink?.url?.includes('postId=')) return handlePost(dynamicLink)
    }

    const USER = 'users'

      PushNotification.configure({
    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification(notification) {
      console.log('NOTIFICATION:', notification);
      if(notification.data.type === 'messaging') {
        const cid = `${notification.data.type}-${notification.data.id}`
        // const channel = {
        //   id: notification.data.id,
        //   cid
        // }
        // setChannel(channel, dispatch);
        // navigation.navigate('ChatDetailPage');
              // setChannel(notification.data, dispatch);
              // navigation.navigate('ChatDetailPage');

      }
      // process the notification
      // (required) Called when a remote is received or opened, or local notification is opened
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    // (optional) Called when the user fails to register for remote notifications.
    // Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    onRegistrationError(err) {
      console.error(err.message, err);
    },
    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,
    requestPermissions: true,
  });

    const getUserProfile = async (url) => {
        if (url && typeof url === 'string') {
            const userId = await getUserId()
            const splitUser = url.split('/')
            let data = {}
            const params = splitUser[splitUser.length - 1]
            const splitParams = params.split('?')
            const type = splitParams[0]
            const splitting = splitParams[splitParams.length - 1].split('&')
            if (Array.isArray(splitting) && splitting.length > 0) {
                splitting.map((value) => {
                    const mapSplit = value.split('=')
                    data = { ...data, [mapSplit[0]]: mapSplit[mapSplit.length - 1] }
                })
            }
            data = { ...data, user_id: userId }
            handleMovePage(type, data)
        }
    }

    const handleMovePage = async (type, data) => {
        switch (type) {
            case USER:
                navigation.navigate('OtherProfile', {
                    data
                })
                break
            default:
                return null
        }
    }

    const handleBgDynamicLink = () => {
        dynamicLinks().getInitialLink().then((data) => {
            if (data) {
                getUserProfile(data.url)
            }
        })
    }

    const handleFgDynamicLink = () => {
        dynamicLinks().onLink((link) => {
            if (link) {
                getUserProfile(link.url)
            }
        })
    }

    const handleExpiredPost = async (dynamicLink) => {
        SimpleToast.show(StringConstant.dynamicLinkPostExpired, SimpleToast.SHORT)
        return navigation.navigate('Feed')
    }

    const checkIsAuthorFollowingMe = async (postId) => {
        let response = await isAuthorFollowingMe(postId)
        let isAuthorFollowing = response?.success
        let errorCode = response?.code

        if (!isAuthorFollowing && errorCode === POST_CHECK_FEED_NOT_FOUND) {
            SimpleToast.show(StringConstant.dynamicLinkPostCannotBeFound, SimpleToast.SHORT)
            return navigation.navigate('Feed')
        }

        if (!isAuthorFollowing && errorCode === POST_CHECK_AUTHOR_NOT_FOLLOWING) {
            SimpleToast.show(StringConstant.dynamicLinkAuthorNotFollowing, SimpleToast.SHORT)
            return navigation.navigate('Feed')
        }

        if (!isAuthorFollowing && errorCode === POST_CHECK_AUTHOR_BLOCKED) {
            SimpleToast.show(StringConstant.dynamicLinkAuthorBlocks, SimpleToast.SHORT)
            return navigation.navigate('Feed')
        }

        if (!isAuthorFollowing && errorCode === POST_CHECK_FEED_EXPIRED) {
            SimpleToast.show(StringConstant.dynamicLinkPostExpired, SimpleToast.SHORT)
            return navigation.navigate('Feed')
        }

        return navigation?.navigate('PostDetailPage', {
            feedId: postId,
            refreshCache: null,
            isCaching: false
        })
    }

    const handlePost = async (dynamicLink) => {
        let postId = dynamicLink.url.split('postId=')[1]
        postId = postId?.length > 36 ? postId.substring(0, 36) : postId
        checkIsAuthorFollowingMe(postId)
    }

    const handlePrivatePost = async (dynamicLink) => {
        let postId = dynamicLink.url.split('postPrivateId=')[1]
        checkIsAuthorFollowingMe(postId)
    }

    return (
        <>
        </>
    )
}

FirebaseConfig.propTypes = {
    navigation: PropTypes.object
}


export default FirebaseConfig
