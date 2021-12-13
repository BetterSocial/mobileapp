import React, {memo} from 'react'
import { View, Text, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    headerContainer: {
        alignItems: 'center',
        paddingVertical: 5
    }
})

const TopicHeader = () => {
   return (
    <View style={styles.headerContainer} >
    <Text>
        Nobody else can see the Topics you're following!
    </Text>
    </View>
   )
}


export default memo(TopicHeader)