import * as React from 'react';
import reactStringReplace from 'react-string-replace';
import { StyleSheet, Text } from 'react-native';
import { generateRandomId } from 'stream-chat-react-native-core';

import { fonts } from '../fonts';

const handleHastagMention = (text = '', hashtags = [], setHashtagState = null, cursorPosition = -1) => {

    const topicRegex = /\B(\#[a-zA-Z0-9_+-]+\b)(?!;)/g
    const mentionRegex = /\B(\@[a-zA-Z0-9_+-]+\b)(?!;)/;

    const topicOccurence = []
    const reactStringHashtags = reactStringReplace(
        text,
        topicRegex,
        (match) => {
            const isHashtagUnique = !topicOccurence?.includes(match?.substring(1))
            const isHashtagInTopic = hashtags?.includes(match?.substring(1))

            if (topicOccurence?.length > 4 || !isHashtagUnique) return match

            if (isHashtagInTopic || isHashtagUnique) {
                topicOccurence?.push(match?.substring(1))
                return <Text key={generateRandomId()} style={styles.mention}>
                    {`${match}`}
                </Text>
            }

            // const word = match?.substring(1)
            // const wordLastIndexInWholeText = text?.lastIndexOf(word) + word?.length
            // const isTyping = cursorPosition === wordLastIndexInWholeText - 1
            // if (isTyping) {
            //     return <Text key={generateRandomId()} style={styles.mention}>
            //         {match}
            //     </Text>
            // }

            // return match

            return <Text key={generateRandomId()} style={styles.mention}>
                {match}
            </Text>
        })


    const reactStringMention = reactStringReplace(
        reactStringHashtags,
        mentionRegex,
        (match) => <Text key={generateRandomId()} style={styles.mention}>
            {match}
        </Text>)

    setHashtagState(topicOccurence)
    return reactStringMention
};

const styles = StyleSheet.create({
    mention: {
        color: '#2F80ED',
        fontFamily: fonts.inter[500],
        fontWeight: "500",
    },
});

export default handleHastagMention;
