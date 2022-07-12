import * as React from 'react';
import { Pressable, StyleSheet, Text } from "react-native"
import { View } from "react-native"
import { useNavigation } from '@react-navigation/native';

import { colors } from "../../utils/colors"
import { fonts } from "../../utils/fonts"

const TopicsChip = ({ topics = [], fontSize = 24, text = '' }) => {
    const navigation = useNavigation()

    const onTopicPress = (topic) => {
        navigation.navigate('TopicPageScreen', { id: topic.replace('#', '') })
    }

    if (topics.length === 0) return <></>

    return <View style={styles.topicContainer}>
        {topics.map((item, index) => {
            if(text.indexOf(`#${item}`) < 0) return <View key={`topicContainer-${index}`} style={styles.topicItemContainer}>
                <Pressable
                    android_ripple={{
                        borderless: false,
                        color: colors.gray1
                    }}
                    onPress={() => onTopicPress(item)}>
                    <Text style={{ ...styles.topicText, fontSize }}>#{item}</Text>
                </Pressable>
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
        marginTop: 12,
        // marginTop: 12,
        // backgroundColor: colors.blue
    },
    topicItemContainer: {
        backgroundColor: colors.lightgrey,
        borderRadius: 14,
        overflow: 'hidden',
        marginEnd: 11,
    },
    topicText: {
        fontFamily: fonts.inter[500],
        paddingHorizontal: 13,
        paddingVertical: 4.5,
        // fontSize: 12,
        // lineHeight: 14.52,
        borderRadius: 14,
        color: colors.blue,
        // backgroundColor: colors.red,
    }
})