import React from 'react';
import Svg, {Path} from 'react-native-svg';

export default function IconCloseBold(props) {
  return (
    <Svg
      width={9}
      height={10}
      viewBox="0 0 9 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M.889 8.34l7.11-7.111M.889 1.229l7.11 7.11"
        stroke="#8C939F"
        strokeWidth={1.55}
        strokeLinecap="round"
      />
    </Svg>
  );
}
