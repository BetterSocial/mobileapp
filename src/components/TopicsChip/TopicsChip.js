import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from "react-native"
import { useNavigation } from '@react-navigation/native';

import { colors } from "../../utils/colors"
import { fonts } from "../../utils/fonts"

const TopicsChip = ({ topics = [], fontSize = 24, text = '', isPdp }) => {
    const navigation = useNavigation()

    const onTopicPress = (topic) => {
        navigation.navigate('TopicPageScreen', { id: topic.replace('#', '') })
    }

    if (topics.length === 0) return <></>

    return <View style={!isPdp ? styles.topicContainer : styles.topicContainerPdp}>
        {topics.map((item, index) => {
            if(text.indexOf(`#${item}`) < 0) return <View key={`topicContainer-${index}`} style={styles.topicItemContainer}>
                <TouchableOpacity
                    testID='topic-chip'
                    activeOpacity={1}
                    // android_ripple={{
                    //     borderless: false,
                    //     color: colors.gray1
                    // }}
                    onPress={() => onTopicPress(item)}>
                    <Text style={{ ...styles.topicText, fontSize }}>#{item}</Text>
                </TouchableOpacity>
            </View>
        })}
    </View>
}

export default TopicsChip

const styles = StyleSheet.create({
    topicContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        position: 'absolute',
        bottom: 5,
        paddingLeft: 16,
        paddingRight: 16,
        // backgroundColor: colors.blue
    },
    topicContainerPdp: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
    },
    topicItemContainer: {
        backgroundColor: colors.lightgrey,
        borderRadius: 14,
        overflow: 'hidden',
        marginEnd: 11,
        marginTop: 5
    },
    topicText: {
        fontFamily: fonts.inter[500],
        paddingHorizontal: 13,
        paddingVertical: 4.5,
        fontSize: 12,
        // lineHeight: 14.52,
        borderRadius: 14,
        color: colors.blue,
        // backgroundColor: colors.red,
    }
})