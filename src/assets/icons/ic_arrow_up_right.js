import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const IcArrowUpRight = (props) => (
  <Svg
    width={11}
    height={11}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 11 11"
    {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.507 6.495a.667.667 0 0 0 .673-.66l.043-4.758A.667.667 0 0 0 9.55.405L4.793.448a.667.667 0 1 0 .012 1.333l3.127-.028L.599 9.085a.667.667 0 1 0 .943.943l7.333-7.333-.028 3.127a.667.667 0 0 0 .66.673Z"
      fill={props.fill || '#000'}
    />
  </Svg>
);

export default IcArrowUpRight;
