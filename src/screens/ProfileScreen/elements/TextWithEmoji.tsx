import React from 'react';
import {Text, StyleSheet} from 'react-native';
import emojiRegex from 'emoji-regex';
import {COLORS} from '../../../utils/theme';
import {fonts} from '../../../utils/fonts';

export function TextWithEmoji({
  text,
  textStyle,
  testId
}: {
  text: string;
  textStyle: object;
  testId: string;
}) {
  return (
    <Text style={[styles.text, textStyle]} testID={testId}>
      {text?.split(' ').map((item: string, index: number) => {
        return (
          <Text
            key={index}
            style={[item.match(emojiRegex()) ? styles.emoji : styles.text, textStyle]}>
            {`${item} `}
          </Text>
        );
      })}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    color: COLORS.white,
    fontFamily: fonts.inter[400],
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20
  },
  emoji: {
    fontSize: 14,
    fontFamily: 'System'
  }
});
