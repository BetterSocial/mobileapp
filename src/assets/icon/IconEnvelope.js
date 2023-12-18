import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {COLORS} from '../../utils/theme';

function IconEnvelope(props) {
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
        d="M3 0a3 3 0 00-3 3v10a3 3 0 003 3h14a3 3 0 003-3V3a3 3 0 00-3-3H3zm-.909 2.582A1 1 0 013 2h14a1 1 0 01.909.582l-7.295 5.674a1 1 0 01-1.228 0L2.091 2.582zM2 5.045v5.82l3.613-3.01L2 5.044zm.083 8.354A1 1 0 003 14h14a1 1 0 00.917-.6L12.771 9.11l-.93.723a3 3 0 01-3.683 0l-.93-.723L2.084 13.4zM18 10.865v-5.82l-3.613 2.81L18 10.864z"
        fill={props.color || COLORS.blue}
      />
    </Svg>
  );
}

export default IconEnvelope;
