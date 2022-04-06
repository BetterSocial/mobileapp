import * as React from 'react';
import {  StyleSheet, Text } from 'react-native';
import { fonts } from '../fonts';

const handleHastag = (text, setFormattedContent) => {
  const retLines = text.split("\n");
  console.log('retline', retLines);
  const formattedText = [];
  retLines.forEach(retLine => {
    const words = retLine.split(' ');
    const contentLength = words.length;
    var format = /[ !#@$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\n]/;
    words.forEach((word, index) => {
      if ((word.startsWith('#') && !format.test(word.substr(1)))) {
        const mention = (
          <Text key={index} style={styles.mention}>
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
        } else {
          return formattedText.push(word);
        }
      }
    });
  });
  setFormattedContent(formattedText);
};

const styles = StyleSheet.create({
  mention: {
    color: '#2F80ED',
    fontSize: 16,
    fontFamily: fonts.inter[500],
    fontWeight: "500",
  },
});

export default handleHastag;
