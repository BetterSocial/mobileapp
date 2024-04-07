import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

function Ic_block_active(props) {
  return (
    <Svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <G clipPath="url(#clip0_20145_80670)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16 8A8 8 0 110 8a8 8 0 0116 0zm-4.075-5.056a6.4 6.4 0 00-8.98 8.98l8.98-8.98zm1.13 1.131a6.4 6.4 0 01-8.98 8.98l8.98-8.98z"
          fill="#FF2E63"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_20145_80670">
          <Path fill="#fff" d="M0 0H16V16H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

const MemoIc_block_active = React.memo(Ic_block_active);
export default MemoIc_block_active;
