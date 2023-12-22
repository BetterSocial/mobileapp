import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const IconAdd = (props) => (
  <Svg width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10Zm0-18a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 2.757a1 1 0 0 1 1 1V9h3.243a1 1 0 1 1 0 2H11v3.243a1 1 0 0 1-2 0V11H5.756a1 1 0 1 1 0-2H9V5.757a1 1 0 0 1 1-1Z"
      fill="#000"
    />
  </Svg>
);

export default IconAdd;
