import * as React from 'react';
import {StyleSheet, Text} from 'react-native';
import {generateRandomId} from 'stream-chat-react-native-core';

import {fonts} from '../fonts';
import {COLORS} from '../theme';

const handleMention = (text, setFormattedContent) => {
  const retLines = text.split('\n');
  const arrText = [];
  for (let i = 0; i < retLines.length; i++) {
    arrText.push(retLines[i]);
    if (i !== retLines.length - 1) {
      arrText.push('\n');
    }
  }
  const formattedText = [];
  arrText.forEach((retLine) => {
    const words = retLine.split(' ');
    const contentLength = words.length;
    const format = /[ !#@$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\n]/;
    // eslint-disable-next-line consistent-return
    words.forEach((word, index) => {
      const randomId = generateRandomId();
      if (word.startsWith('@') && !format.test(word.substr(1))) {
        const mention = (
          <Text key={randomId} style={styles.mention}>
            {word}
          </Text>
        );
        if (index !== contentLength - 1) {
          formattedText.push(mention, ' ');
        } else {
          formattedText.push(mention);
        }
      } else {
        if (index !== contentLength - 1) {
          return formattedText.push(word, ' ');
        }
        return formattedText.push(word);
      }
    });
  });
  setFormattedContent(formattedText);
};

const styles = StyleSheet.create({
  mention: {
    color: COLORS.blue,
    fontFamily: fonts.inter[500],
    fontWeight: '500'
  }
});

export default handleMention;
