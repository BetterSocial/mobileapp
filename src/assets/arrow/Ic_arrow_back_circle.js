import * as React from 'react';
import Svg, {Rect, Path} from 'react-native-svg';

function IcArrowBackCircle(props) {
  return (
    <Svg
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Rect width={32} height={32} rx={16} fill="#000" fillOpacity={0.6} />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.124 20.726a.888.888 0 01-1.273.011L7.27 16.154a.925.925 0 010-1.308l4.582-4.583a.888.888 0 011.273.011.929.929 0 01-.011 1.297L10.1 14.583H24.1c.497 0 .9.41.9.917a.908.908 0 01-.9.917h-14l3.013 3.012c.354.355.36.936.01 1.297z"
        fill="#fff"
      />
    </Svg>
  );
}

export default IcArrowBackCircle;
