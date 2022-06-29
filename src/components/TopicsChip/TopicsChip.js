import * as React from 'react';
import { Pressable, StyleSheet, Text } from "react-native"
import { View } from "react-native"

import { colors } from "../../utils/colors"
import { fonts } from "../../utils/fonts"

const TopicsChip = ({ topics = [] }) => {
    if (topics.length === 0) return <></>

    return <View style={styles.topicContainer}>
        {topics.map((item, index) => {
            return <View key={`topicContainer-${index}`} style={styles.topicItemContainer}>
                <Pressable
                    android_ripple={{
                        borderless: false,
                        color: colors.gray1
                    }}
                    onPress={() => console.log(`press topic ${item}`)}>
                    <Text style={styles.topicText}>#{item}</Text>
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
        // backgroundColor: colors.red
    },
    topicItemContainer: {
        backgroundColor: colors.lightgrey,
        borderRadius: 14,
        overflow: 'hidden',
        marginEnd: 11,
    },
    topicText: {
        fontFamily: fonts.inter[500],
        paddingHorizontal: 15,
        paddingVertical: 6.5,
        fontSize: 12,
        lineHeight: 14.52,
        borderRadius: 20,
        color: colors.blue,
        // backgroundColor: colors.red,
    }
})