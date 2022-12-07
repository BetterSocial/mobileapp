import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import { generateRandomId } from 'stream-chat-react-native-core';

import { fonts } from '../fonts';

const handleHastagMention = (text = '', hashtags = []) => {
    const retLines = text.split("\n");
    const arrText = new Array();
    for (let i = 0; i < retLines.length; i++) {
        arrText.push(retLines[i]);
        if (i != retLines.length - 1) {
            arrText.push("\n");
        }
    }

    const formattedText = [];
    arrText.forEach(retLine => {
        const words = retLine.split(' ');
        const contentLength = words.length;
        const formatMention = /[ !#@$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\n]/;
        const formatHashtag = /[ !#@$%^&*()=+\[\]{};':"\\|,.<>\/?\n]/;
        words.forEach((word, index) => {
            const randomId = generateRandomId();
            const mention = (
                <Text key={randomId} style={styles.mention}>
                    {word}
                </Text>
            )
            const isNotInContentLength = index !== contentLength - 1

            if (
                (word.startsWith("@") && !formatMention.test(word.substr(1))) ||
                (word.startsWith("#") && !formatHashtag.test(word.substr(1)) && hashtags.includes(word.substr(1)))
            ) {
                return formattedText.push(mention, isNotInContentLength ? ' ' : '');
            }

            if ((word.startsWith("#") && !formatHashtag.test(word.substr(1)))) {
                return formattedText.push(mention, isNotInContentLength ? ' ' : '');
            }

            return formattedText.push(word, isNotInContentLength ? ' ' : '');

        });
    });
    return formattedText
};

const styles = StyleSheet.create({
    mention: {
        color: '#2F80ED',
        fontFamily: fonts.inter[500],
        fontWeight: "500",
    },
});

export default handleHastagMention;
