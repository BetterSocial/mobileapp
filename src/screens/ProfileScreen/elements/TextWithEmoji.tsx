import React from 'react';
import {Text, StyleSheet} from 'react-native';
import emojiRegex from 'emoji-regex';
import {COLORS} from '../../../utils/theme';

export function TextWithEmoji({text}: {text: string}) {
  return (
    <Text style={styles.text}>
      {text.split(' ').map((item: string, index: number) => {
        return (
          <Text key={index} style={item.match(emojiRegex()) ? styles.emoji : styles.text}>
            {`${item} `}
          </Text>
        );
      })}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    color: COLORS.lightgrey,
    fontFamily: 'Inter',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    marginBottom: 12,
    lineHeight: 20
  },
  emoji: {
    fontSize: 14,
    fontFamily: 'System'
  }
});
