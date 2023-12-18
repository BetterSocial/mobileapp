import * as React from 'react';
import PropTypes from 'prop-types';
import Svg, {Path} from 'react-native-svg';
import {COLORS} from '../../utils/theme';

const IconChatCheckMark = (props) => (
  <Svg
    width={15}
    height={11}
    fill="none"
    viewBox="0 0 15 11"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.181.257c.357.349.364.92.015 1.277l-8.821 9.034a.903.903 0 0 1-1.336-.047L.214 6.003a.903.903 0 0 1 1.379-1.168l3.183 3.759L12.904.272A.903.903 0 0 1 14.18.257Z"
      fill={props.color ?? COLORS.blackgrey}
    />
  </Svg>
);

IconChatCheckMark.propTypes = {
  color: PropTypes.string
};

export default IconChatCheckMark;
