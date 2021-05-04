import React from 'react'
import { useEffect } from 'react'
import { Text } from 'react-native'

export default function TopicFragmentScreen({navigation}) {
    useEffect(() => {
        navigation.setOptions({
            title : "Topics (3)"
        })    
    },[])
    return <Text>Topic</Text>
}
