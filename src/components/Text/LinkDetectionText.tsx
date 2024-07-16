import * as React from 'react';
import {StyleProp, Text, TextStyle} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import TopicDetectionOnChat from './TopicDetectionOnChat';
import {LinkableText} from '../LinkableText';
import {isValidUrl} from '../../utils/string/StringUtils';

export type LinkDetectionTextProps = {
  text: string;
  linkTextStyle?: StyleProp<TextStyle>;
  textStyle?: StyleProp<TextStyle>;
  parentTextStyle?: StyleProp<TextStyle>;
  withTopicDetection?: boolean;
};

const LinkDetectionText = ({
  text,
  linkTextStyle = {},
  parentTextStyle = {},
  textStyle = null,
  withTopicDetection = false
}: LinkDetectionTextProps) => {
  const navigation = useNavigation();

  const sanitizedTextPerLine = text?.split('\n');

  const handleTopicPress = (topic: string) => {
    const navigationParam = {
      id: topic
    };

    navigation.navigate('TopicPageScreen', navigationParam);
  };

  if (!textStyle) textStyle = linkTextStyle;

  return (
    <Text style={parentTextStyle}>
      {sanitizedTextPerLine?.map((line, index) => {
        if (index < sanitizedTextPerLine?.length - 1) {
          line += '\n';
        }

        if (isValidUrl(line))
          return (
            <LinkableText
              style={linkTextStyle}
              text={line}
              withTopicDetection={withTopicDetection}
              isFirstLine={index === 0}
            />
          );

        return (
          <Text key={index} style={[textStyle]}>
            {withTopicDetection && (
              <TopicDetectionOnChat
                text={line}
                onPress={handleTopicPress}
                isFirstLine={index === 0}
              />
            )}
            {!withTopicDetection && line}
          </Text>
        );
      })}
    </Text>
  );
};

const MemoLinkDetectionText = React.memo(LinkDetectionText);

export default MemoLinkDetectionText;
