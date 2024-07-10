import * as React from 'react';
import {StyleProp, Text, TextStyle} from 'react-native';

import {LinkableText} from '../LinkableText';
import {isValidUrl} from '../../utils/string/StringUtils';

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
  const sanitizedTextPerLine = text?.split('\n');

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
            {line}
          </Text>
        );
      })}
    </Text>
  );
};

const MemoLinkDetectionText = React.memo(LinkDetectionText);

export default MemoLinkDetectionText;
