import React from 'react'
import dynamicLinks from '@react-native-firebase/dynamic-links';
import PropTypes from 'prop-types';
import { getUserId } from '../utils/users';
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

    React.useEffect(() => {
        handleBgDynamicLink()
        handleFgDynamicLink()
    })

    return (
        <>
        </>
    )
}

FirebaseConfig.propTypes = {
    navigation: PropTypes.object
}


export default FirebaseConfig