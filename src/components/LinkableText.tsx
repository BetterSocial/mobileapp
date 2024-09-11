import React, {useCallback, useState} from 'react';
import {Linking, StyleProp, Text, TextStyle} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import TopicDetectionOnChat from './Text/TopicDetectionOnChat';
import {COLORS} from '../utils/theme';
import {checkValidUrl} from '../service/chat';

interface Props {
  text: string;
  style?: StyleProp<TextStyle>;
  multiline?: false;
  withTopicDetection?: boolean;
  isFirstLine?: boolean;
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
      id: topic
    };

    navigation.navigate('TopicPageScreen', navigationParam);
  };

  // Regular expression to match URLs
  const urlRegex = /^((?:https?:\/\/)?[^./]+(?:\.[^./]+)+(?:\/c\/[A-Z0-9-]+)?(?:\/.*)?)$/i;
  const regexPrefix = /(http|https)/;

  // Split the text by URLs
  const parts = text.split(' ');

  const checkUrl = useCallback((t: string) => {
    const [isValid, setValid] = useState(false);
    if (urlRegex.test(t?.toLocaleLowerCase())) {
      const urls = `http://${t?.trim().toLocaleLowerCase()}`;
      checkValidUrl(urls)
        .then(() => {
          setValid(true);
        })
        .catch(() => {
          setValid(false);
        });
    }
    return isValid;
  }, []);
  return (
    <Text style={props.style}>
      {parts.map((part, index) => {
        if (urlRegex.test(part?.toLocaleLowerCase())) {
          const result = regexPrefix.test(part) || checkUrl(part);
          if (result) {
            return (
              <Text
                key={index}
                style={{color: COLORS.blueLink, textDecorationLine: 'underline'}}
                onPress={() => handlePress(part)}>
                {index === parts.length - 1 ? `${part}` : `${part} `}
              </Text>
            );
          }
        }
        if (part.startsWith('#') && props.withTopicDetection) {
          return (
            <Text key={index}>
              <TopicDetectionOnChat
                text={part}
                multipart={parts?.length > 1}
                onPress={handleTopicPress}
                isFirstLine={props?.isFirstLine && index === 0}
              />
              <Text> </Text>
            </Text>
          );
        }

        return <Text key={index}>{`${part} `}</Text>;
      })}
    </Text>
  );
};
