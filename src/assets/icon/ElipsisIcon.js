import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {COLORS} from '../../utils/theme';

const ElipsisIcon = (props) => (
  <Svg width={3} height={14} fill={COLORS.blackgrey} xmlns="http://www.w3.org/2000/svg" {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.708 1.575c0-.79-.597-1.43-1.333-1.43C.638.145.04.785.04 1.575c0 .79.597 1.43 1.334 1.43.736 0 1.333-.64 1.333-1.43Zm0 5.006c0-.79-.597-1.43-1.333-1.43C.638 5.15.04 5.79.04 6.58c0 .79.597 1.43 1.334 1.43.736 0 1.333-.64 1.333-1.43Zm-1.333 3.575c.736 0 1.333.64 1.333 1.43 0 .79-.597 1.43-1.333 1.43-.737 0-1.334-.64-1.334-1.43 0-.79.597-1.43 1.334-1.43Z"
    />
  </Svg>
);

export default ElipsisIcon;
