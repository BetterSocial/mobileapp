import * as React from 'react';
import reactStringReplace from 'react-string-replace';
import {Pressable, Text} from 'react-native';

import {COLORS} from '../../utils/theme';
import {fonts} from '../../utils/fonts';

export type TopicDetectionOnChatProps = {
  text: string;
  onPress?: (topic: string) => void;
  multipart?: boolean;
  isFirstLine?: boolean;
};

const TopicDetectionOnChat = ({
  text,
  onPress,
  multipart = false,
  isFirstLine = false
}: TopicDetectionOnChatProps) => {
  const topicRegex = /\B(\#[a-zA-Z0-9_+-]+\b)(?!;)/g;
  return reactStringReplace(text, topicRegex, (match) => {
    const topicStringOnly = match?.replace('#', '');
    const getMarginTop = () => {
      if (text.indexOf(match) !== 0) return -1;
      if (isFirstLine) return -3;
      if (multipart) return -1;
      return 0;
    };
    return (
      <Pressable
        style={({pressed}) => ({
          backgroundColor: pressed ? COLORS.white30percent : 'transparent',
          marginTop: getMarginTop()
        })}
        onPress={() => onPress?.(topicStringOnly)}>
        <Text
          key={`topic-${match}`}
          style={{
            color: COLORS.blueLink,
            fontSize: 16,
            fontFamily: fonts.inter[500]
          }}>
          {match}
        </Text>
      </Pressable>
    );
  });
};

export default TopicDetectionOnChat;
