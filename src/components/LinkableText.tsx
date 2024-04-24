import React from 'react';
import {Text, Linking} from 'react-native';
import {COLORS} from '../utils/theme';

interface Props {
  text: string;
  style?: object;
}

export const LinkableText: React.FC<Props> = ({text, ...props}) => {
  const handlePress = (url: string) => {
    Linking.openURL(url);
  };

  // Regular expression to match URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  // Split the text by URLs
  const parts = text.split(urlRegex);

  return (
    <Text style={props.style}>
      {parts.map((part, index) =>
        urlRegex.test(part) ? (
          <Text
            key={index}
            style={{color: COLORS.blueLink, textDecorationLine: 'underline'}}
            onPress={() => handlePress(part)}>
            {part}
          </Text>
        ) : (
          <Text key={index}>{part}</Text>
        )
      )}
    </Text>
  );
};
