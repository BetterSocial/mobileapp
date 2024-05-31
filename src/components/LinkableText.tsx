import React from 'react';
import {Linking, Text} from 'react-native';

import {COLORS} from '../utils/theme';

interface Props {
  text: string;
  style?: object;
}

export const LinkableText: React.FC<Props> = ({text, ...props}) => {
  const handlePress = (url: string) => {
    const regex = /(http|https)/;
    if (!regex.test(url)) {
      const urls = `http://${url?.trim()}`;
      Linking.openURL(urls);
    } else {
      Linking.openURL(url);
    }
  };

  // Regular expression to match URLs
  const urlRegex = /^((?:https?:\/\/)?[^./]+(?:\.[^./]+)+(?:\/.*)?)$/;

  // Split the text by URLs
  const parts = text.split(' ');

  return (
    <Text style={props.style}>
      {parts.map((part, index) =>
        urlRegex.test(part?.toLocaleLowerCase()) ? (
          <Text
            key={index}
            style={{color: COLORS.blueLink, textDecorationLine: 'underline'}}
            onPress={() => handlePress(part)}>
            {`${part} `}
          </Text>
        ) : (
          <Text key={index}>{`${part} `}</Text>
        )
      )}
    </Text>
  );
};
