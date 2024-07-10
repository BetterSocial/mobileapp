import * as React from 'react';
import reactStringReplace from 'react-string-replace';
import {Pressable, StyleProp, StyleSheet, Text, TextStyle} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import {COLORS} from '../../utils/theme';
import {LinkableText} from '../LinkableText';
import {
  convertTopicNameToTopicPageScreenParam,
  isValidUrl,
  replaceTopicWithPressableText
} from '../../utils/string/StringUtils';
import {fonts} from '../../utils/fonts';

export type LinkDetectionTextProps = {
  text: string;
  linkTextStyle?: StyleProp<TextStyle>;
  textStyle?: StyleProp<TextStyle>;
  parentTextStyle?: StyleProp<TextStyle>;
};

const LinkDetectionText = ({
  text,
  linkTextStyle = {},
  parentTextStyle = {},
  textStyle = null
}: LinkDetectionTextProps) => {
  const navigation = useNavigation();

  const sanitizedTextPerLine = text?.split('\n');

  const handleTopicPress = (topic) => {
    const navigationParam = {
      id: convertTopicNameToTopicPageScreenParam(topic)?.replace('#', '')
    };

    navigation.navigate('TopicPageScreen', navigationParam);
  };

  if (!textStyle) textStyle = linkTextStyle;

  return (
    <Text style={[parentTextStyle]}>
      {sanitizedTextPerLine?.map((line, index) => {
        if (index < sanitizedTextPerLine?.length - 1) {
          line += '\n';
        }

        if (isValidUrl(line)) return <LinkableText style={[linkTextStyle]} text={line} />;

        return (
          <Text key={index} style={[textStyle]}>
            {replaceTopicWithPressableText(line, handleTopicPress)}
          </Text>
        );
      })}
    </Text>
  );
};

const MemoLinkDetectionText = React.memo(LinkDetectionText);

export default MemoLinkDetectionText;
