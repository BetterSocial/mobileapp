import * as React from 'react';
import PropTypes from 'prop-types';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

const IconVideoPlay = (props) => (
  <Svg
    width={props?.width ?? 48}
    height={props?.height ?? 48}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <G clipPath="url(#clip0_8_21738)">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 24c0 13.255 10.745 24 24 24s24-10.745 24-24S37.255 0 24 0 0 10.745 0 24zm4.8 0C4.8 13.396 13.396 4.8 24 4.8S43.2 13.396 43.2 24 34.604 43.2 24 43.2 4.8 34.604 4.8 24zm15.668-6.916a2.4 2.4 0 012.463.12l7.2 4.8a2.4 2.4 0 010 3.993l-7.2 4.8A2.4 2.4 0 0119.2 28.8v-9.6a2.4 2.4 0 011.268-2.116z"
        fill="#F5F6F7"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_8_21738">
        <Path fill="#fff" d="M0 0H48V48H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

IconVideoPlay.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number
};

export default IconVideoPlay;
