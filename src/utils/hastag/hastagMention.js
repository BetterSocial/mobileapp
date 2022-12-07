import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import { generateRandomId } from 'stream-chat-react-native-core';

import { fonts } from '../fonts';

const handleHastagMention = (text = '', hashtags = [], cursorPosition = -1) => {
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

            /**
             * Check if each word is mention OR
             * each hashtag is included in hashtags defined in topic box
             * This will ensure automatic style change if there are any addition or deletion in topic box
             */
            if (
                (word.startsWith("@") && !formatMention.test(word.substr(1))) ||
                (word.startsWith("#") && !formatHashtag.test(word.substr(1)) && hashtags.includes(word.substr(1)))
            ) {
                return formattedText.push(mention, isNotInContentLength ? ' ' : '');
            }

            /**
             * Check if hashtag is being typed, change the style if it is.
             */
            if ((word.startsWith("#") && !formatHashtag.test(word.substr(1)))) {
                const wordLastIndexInWholeText = text?.lastIndexOf(word) + word?.length
                if (wordLastIndexInWholeText - 1 === cursorPosition) {
                    return formattedText.push(mention, isNotInContentLength ? ' ' : '');
                }
            }

            /**
             * Return plain text otherwise
             */
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
