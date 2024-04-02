import * as React from 'react';
import PropTypes from 'prop-types';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

function IconAdd(props) {
  return (
    <Svg
      viewBox="0 0 24 24"
      width={props?.width ?? 20}
      height={props?.height ?? 20}
      fill={props?.fill}
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <G clipPath="url(#clip0_19924_1680)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 24C5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12-5.373 12-12 12zm0-21.6a9.6 9.6 0 100 19.2 9.6 9.6 0 000-19.2zm0 3.309a1.2 1.2 0 011.2 1.2V10.8h3.891a1.2 1.2 0 010 2.4h-3.89v3.891a1.2 1.2 0 11-2.4 0V13.2H6.909a1.2 1.2 0 010-2.4H10.8V6.909a1.2 1.2 0 011.2-1.2z"
          fill="#69707C"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_19924_1680">
          <Path fill="#fff" d="M0 0H24V24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

IconAdd.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.string
};
export default IconAdd;
