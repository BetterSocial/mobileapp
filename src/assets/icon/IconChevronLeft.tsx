import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {COLORS} from '../../utils/theme';

export default function IconChevronLeft(props) {
  return (
    <Svg width="8" height="20" viewBox="0 0 8 20" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.70711 3.29289C7.31658 2.90237 6.68342 2.90237 6.29289 3.29289L0.292893 9.29289C-0.0976315 9.68342 -0.0976315 10.3166 0.292893 10.7071L6.29289 16.7071C6.68342 17.0976 7.31658 17.0976 7.70711 16.7071C8.09763 16.3166 8.09763 15.6834 7.70711 15.2929L2.41421 10L7.70711 4.70711C8.09763 4.31658 8.09763 3.68342 7.70711 3.29289Z"
        fill={props.fill || COLORS.white}
      />
    </Svg>
  );
}
