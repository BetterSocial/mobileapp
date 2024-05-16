import React from 'react';
import emojiRegex from 'emoji-regex';
import {StyleSheet, Text} from 'react-native';

import {COLORS} from '../../../utils/theme';
import {LinkableText} from '../../../components/LinkableText';
import {fonts} from '../../../utils/fonts';
import {isValidUrl} from '../../../utils/string/StringUtils';

export function TextWithEmoji({
  text,
  textStyle,
  testId
}: {
  text: string;
  textStyle: object;
  testId: string;
}) {
  const sanitizeNewLine = text?.split('\n');

  return (
    <Text style={[styles.text, textStyle]} testID={testId}>
      {sanitizeNewLine?.map((item: string, index: number) => {
        if (index < sanitizeNewLine?.length - 1) {
          item += '\n';
        }

        if (isValidUrl(item)) {
          return <LinkableText text={item} key={`${item}-${index}`} />;
        }

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
