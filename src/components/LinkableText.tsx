import React from 'react';
import {Linking, Text} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import {COLORS} from '../utils/theme';
import {
  convertTopicNameToTopicPageScreenParam,
  replaceTopicWithPressableText
} from '../utils/string/StringUtils';

interface Props {
  text: string;
  style?: object;
}

export const LinkableText: React.FC<Props> = ({text, ...props}) => {
  const navigation = useNavigation();

  const handlePress = (url: string) => {
    const regex = /(http|https)/;
    if (!regex.test(url)) {
      const urls = `http://${url?.trim()}`;
      Linking.openURL(urls);
    } else {
      Linking.openURL(url);
    }
  };

  const handleTopicPress = (topic) => {
    const navigationParam = {
      id: convertTopicNameToTopicPageScreenParam(topic)?.replace('#', '')
    };

    navigation.navigate('TopicPageScreen', navigationParam);
  };

  // Regular expression to match URLs
  const urlRegex = /^((?:https?:\/\/)?[^./]+(?:\.[^./]+)+(?:\/.*)?)$/;

  // Split the text by URLs
  const parts = text.split(' ');

  return (
    <Text style={props.style}>
      {parts.map((part, index) => {
        if (urlRegex.test(part?.toLocaleLowerCase())) {
          return (
            <Text
              key={index}
              style={{color: COLORS.blueLink, textDecorationLine: 'underline'}}
              onPress={() => handlePress(part)}>
              {`${part} `}
            </Text>
          );
        }
        if (part.startsWith('#')) {
          return (
            <Text key={index}>
              {replaceTopicWithPressableText(part, () => handleTopicPress(part))}
              <Text> </Text>
            </Text>
          );
        }

        return <Text key={index}>{`${part} `}</Text>;
      })}
    </Text>
  );
};
