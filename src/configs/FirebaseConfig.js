import PropTypes from 'prop-types';
import React from 'react'
import SimpleToast from 'react-native-simple-toast'
import dynamicLinks from '@react-native-firebase/dynamic-links';

import { getUserId } from '../utils/users';
import { isAuthorFollowingMe } from '../service/post';

const FirebaseConfig = (props) => {
    const { navigation } = props

    const USER = 'users'
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

    /**
     * 
     * @param {FirebaseDynamicLinksTypes.DynamicLink} dynamicLink 
     */
    const parseDynamicLink = async (dynamicLink) => {
        console.log('dynamicLink', dynamicLink?.url)
        if (dynamicLink?.url?.includes('postExpired=true')) {
            SimpleToast.show('This post has expired and has been deleted automatically', SimpleToast.SHORT)
            return navigation.navigate('Feed')
        }

        if (dynamicLink?.url?.includes('postPrivateId=')) {
            let postId = dynamicLink.url.split('postPrivateId=')[1]
            let response = await isAuthorFollowingMe(postId)
            let isAuthorFollowing = response?.success
            if (!isAuthorFollowing) {
                if (response?.code === 1) {
                    SimpleToast.show('Post is not found', SimpleToast.SHORT)
                    return
                }

                if (response?.code === 2) {
                    SimpleToast.show('You cannot access this private post', SimpleToast.SHORT)
                    return navigation.navigate('Feed')
                }
                
                if (response?.code === 3) {
                    SimpleToast.show('This post has expired and has been deleted automatically', SimpleToast.SHORT)
                    return
                }
            }

            return navigation?.navigate('PostDetailPage', {
                feedId: postId,
                refreshCache: null,
                isCaching: false
            })
        }

        if (dynamicLink?.url?.includes('postId=')) {
            let postId = dynamicLink.url.split('postId=')[1]
            postId = postId?.length > 36 ? postId.substring(0, 36) : postId
            navigation?.navigate('PostDetailPage', {
                feedId: postId,
                refreshCache: null,
                isCaching: false
            })
            // return navigation.navigate('PostDetail', { postId })
        }
    }

    React.useEffect(() => {
        handleBgDynamicLink()
        handleFgDynamicLink()
    })

    React.useEffect(() => {
        const unsubscribe = dynamicLinks().onLink(parseDynamicLink)
        return () => unsubscribe()
    }, [])

    return (
        <>
        </>
    )
}

FirebaseConfig.propTypes = {
    navigation: PropTypes.object
}


export default FirebaseConfig
