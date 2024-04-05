import * as React from 'react';
import {Text} from 'react-native';

import {fonts, normalizeFontSize} from '../../../utils/fonts';
import {COLORS} from '../../../utils/theme';
import dimen from '../../../utils/dimen';

type Props = {
  text: string;
};

const TopicMemberHeadline = ({text}: Props) => {
  return (
    <Text
      style={{
        fontSize: normalizeFontSize(12),
        lineHeight: normalizeFontSize(18),
        fontFamily: fonts.inter[600],
        color: COLORS.black,
        paddingVertical: dimen.normalizeDimen(8),
        paddingHorizontal: dimen.normalizeDimen(22),
        backgroundColor: COLORS.almostBlack
      }}>
      {text}
    </Text>
  );
};

export default TopicMemberHeadline;
