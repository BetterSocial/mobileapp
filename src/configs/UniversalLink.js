import React from "react";
import {Linking, Platform} from 'react-native'
import dynamic from '@react-native-firebase/dynamic-links'
import { getUserId } from "../utils/users";


const UniversalLink = (props) => {
    const {navigation} = props
        const USER = 'users'
    const handleUniversalLink = async () => {
        if(Platform.OS === 'ios') {
            const userId = await getUserId()
            const initialUrl = await Linking.getInitialURL()
            if(initialUrl) {
                handleActionLink(initialUrl, userId)
            }
   
        }
    }

    const handleActionLink = (deeplinkUrl, userId) => {
            let initialUrl = decodeURIComponent(deeplinkUrl)
            initialUrl = initialUrl.split('link=')
            initialUrl = initialUrl[initialUrl.length - 1].split('&').find((val) => val.includes('username')) 
            let type = initialUrl.split('?')
            type = type[0].split('/')
            type = type[type.length - 1]
            if(initialUrl) {
                initialUrl = initialUrl.split('=')
                const username = initialUrl[initialUrl.length - 1]
                handleMovePage(type, {username, userId})

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
    const handleFgUniversalLink = async (data) => {
         const userId = await getUserId()
         if(data.url) {
            handleActionLink(data.url, userId)
         }

    }
    React.useEffect(() => {
        handleUniversalLink()
        Linking.addEventListener('url', handleFgUniversalLink)
    }, [])

    return (
        <></>
    )
}


export default UniversalLink