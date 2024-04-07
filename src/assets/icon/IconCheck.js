import * as React from 'react';
import PropTypes from 'prop-types';
import Svg, {G, Path, Defs, ClipPath, Rect} from 'react-native-svg';

function IconCheck(props) {
  return (
    <Svg
      viewBox="0 0 24 24"
      width={props?.width ?? 20}
      height={props?.height ?? 20}
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <G clipPath="url(#clip0_19924_30913)">
        <Path fill={props?.fill || '#4782D7'} d="M-4.5 -5.25H28.5V28.5H-4.5z" />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M17.774 7.713a.75.75 0 01.013 1.061l-7.325 7.5a.75.75 0 01-1.109-.04l-3.175-3.75a.75.75 0 111.144-.969l2.643 3.121 6.748-6.91a.75.75 0 011.061-.013z"
          fill="#fff"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_19924_30913">
          <Rect width={24} height={24} rx={12} fill="#fff" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

IconCheck.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.string
};
export default IconCheck;
