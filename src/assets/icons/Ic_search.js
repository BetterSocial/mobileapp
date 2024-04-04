import * as React from 'react';
import Svg, {Path, G, Defs, ClipPath} from 'react-native-svg';

function Ic_search(props) {
  return (
    <Svg
      width={17}
      height={17}
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <G clipPath="url(#clip0_20145_82994)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0 6.375a6.375 6.375 0 0010.281 5.038c.041.086.097.167.168.238l5.1 5.1a.85.85 0 101.202-1.202l-5.1-5.1a.849.849 0 00-.238-.168A6.375 6.375 0 100 6.375zm1.7 0a4.675 4.675 0 119.35 0 4.675 4.675 0 01-9.35 0z"
          fill={props?.fill || '#000'}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_20145_82994">
          <Path fill={props?.fill || '#000'} d="M0 0H17V17H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

const MemoIc_search = React.memo(Ic_search);
export default MemoIc_search;
