import * as React from 'react';
import {Text} from 'react-native';

import {fonts, normalize} from '../../../utils/fonts';
import {COLORS} from '../../../utils/theme';

type Props = {
  text: string;
};

const TopicMemberHeadline = ({text}: Props) => {
  return (
    <Text
      style={{
        fontSize: 12,
        lineHeight: 18,
        fontFamily: fonts.inter[600],
        color: COLORS.black,
        paddingVertical: normalize(8),
        paddingHorizontal: normalize(22),
        backgroundColor: COLORS.almostBlack
      }}>
      {text}
    </Text>
  );
};

export default TopicMemberHeadline;
