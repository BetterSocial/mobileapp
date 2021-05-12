import React, { useEffect } from 'react'
import { Text } from 'react-native'

export default function DomainFragmentScreen({navigation}) {
    useEffect(() => {
        navigation.setOptions({
            title : "Domains (3)"
        })    
    },[])

    return <Text>Domain</Text>
}
