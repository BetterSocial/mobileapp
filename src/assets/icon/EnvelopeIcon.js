import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {COLORS} from '../../utils/theme';

const EnvelopeIcon = (props) => {
  const {color} = props;
  return (
    <Svg
      width={20}
      height={16}
      viewBox="0 0 20 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 0C1.34315 0 0 1.34315 0 3V13C0 14.6569 1.34315 16 3 16H17C18.6569 16 20 14.6569 20 13V3C20 1.34315 18.6569 0 17 0H3ZM2.09132 2.58194C2.24961 2.23843 2.59696 2 3 2H17C17.403 2 17.7504 2.23843 17.9087 2.58194L10.6139 8.25563C10.2528 8.53649 9.74717 8.53649 9.38606 8.25563L2.09132 2.58194ZM2 5.04464V10.865L5.61261 7.85445L2 5.04464ZM2.0829 13.3993C2.23705 13.7529 2.58966 14 3 14H17C17.4103 14 17.763 13.7529 17.9171 13.3993L12.7715 9.11127L11.8418 9.83433C10.7585 10.6769 9.24151 10.6769 8.15818 9.83433L7.22853 9.11127L2.0829 13.3993ZM18 10.865V5.04464L14.3874 7.85445L18 10.865Z"
        fill={color || COLORS.signed_primary}
      />
    </Svg>
  );
};
export default EnvelopeIcon;
