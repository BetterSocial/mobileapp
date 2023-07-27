import * as React from 'react';
import reactStringReplace from 'react-string-replace';
import {StyleSheet, Text} from 'react-native';
import {generateRandomId} from 'stream-chat-react-native-core';

import {fonts} from '../fonts';
import {COLORS} from '../theme';

const handleHastagMention = (
  text = '',
  hashtags = [],
  setHashtagState = () => {}
  // cursorPosition = -1
) => {
  // eslint-disable-next-line
  const topicRegex = /\B(\#[a-zA-Z0-9_+-]+\b)(?!;)/g;
  // eslint-disable-next-line
  const mentionRegex = /\B(\@[a-zA-Z0-9_+-]+\b)(?!;)/;
  const topicOccurence = [];
  const reactStringHashtags = reactStringReplace(text, topicRegex, (match) => {
    const isHashtagUnique = !topicOccurence?.includes(match?.substring(1));
    const isHashtagInTopic = hashtags?.includes(match?.substring(1));
    if (topicOccurence?.length > 4 || !isHashtagUnique) return match;

    if (isHashtagInTopic || isHashtagUnique) {
      topicOccurence?.push(match?.substring(1));
      return (
        <Text key={generateRandomId()} style={styles.mention}>
          {`${match.toLowerCase()}`}
        </Text>
      );
    }

    return (
      <Text key={generateRandomId()} style={styles.mention}>
        {match}
      </Text>
    );
  });

  const reactStringMention = reactStringReplace(reactStringHashtags, mentionRegex, (match) => (
    <Text key={generateRandomId()} style={styles.mention}>
      {match}
    </Text>
  ));
  if (setHashtagState && typeof setHashtagState === 'function') {
    setHashtagState(topicOccurence);
  }
  return reactStringMention;
};

const styles = StyleSheet.create({
  mention: {
    color: COLORS.blue,
    fontFamily: fonts.inter[500],
    fontWeight: '500'
  }
});

export default handleHastagMention;
