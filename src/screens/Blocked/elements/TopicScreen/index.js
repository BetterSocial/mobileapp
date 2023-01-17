import React from 'react'
import { Text, FlatList } from 'react-native'
import BlockedList from '../RenderList'

const dummyData = [
    {
        name: "detik.com", image: null, description: null
    },
    {
        name: "cnn.com", image: null, description: null
    }
]

const BlockedTopicList = () => (
        <FlatList 
        data={dummyData}
        renderItem={({item ,index}) => <BlockedList isHashtag item={item}  />}
        keyExtractor={(item, index) => index.toString()}

        />
    )


export default React.memo (BlockedTopicList)