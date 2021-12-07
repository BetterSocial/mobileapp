import React from 'react'
import dynamicLinks from '@react-native-firebase/dynamic-links';
import PropTypes from 'prop-types';
import {getUserId} from '../utils/users';
const FirebaseConfig = (props) => {
    const {navigation} = props
    const getUserProfile = async (url) => {
        if(url && typeof url === 'string') {
            const userId =  await getUserId()
            const splitUser = url.split('/')
            const username = splitUser[splitUser.length - 2]
            const userInviteId = splitUser[splitUser.length - 1]
            navigation.navigate('OtherProfile', {
                data: {
                    user_id: userId,
                    other_id: userInviteId,
                    username: username,
                  }
            })
        }
    }
    const handleBgDynamicLink = () => {
        dynamicLinks().getInitialLink().then((data) => {
            console.log(data, 'dynamic link')
            getUserProfile(data.url)
        })
    }

    const handleFgDynamicLink = () => {
        dynamicLinks().onLink((link) => {
            getUserProfile(link.url)
            console.log(link, 'dynamic link1')
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