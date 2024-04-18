import * as React from 'react';
import Svg, {G, Rect, Path, Defs, ClipPath} from 'react-native-svg';

function PostArrowUp(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <G clipPath="url(#clip0_18359_145838)">
        <Rect width={24} height={24} rx={12} fill="#fff" />
        <G clipPath="url(#clip1_18359_145838)">
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12zM12.848 7.551l3.6 3.6a1.2 1.2 0 11-1.697 1.697l-1.551-1.55V15.6a1.2 1.2 0 01-2.4 0v-4.303l-1.551 1.551a1.2 1.2 0 11-1.698-1.697l3.6-3.6a1.2 1.2 0 011.697 0z"
            fill={props.fill || '#0391FB'}
          />
        </G>
      </G>
      <Defs>
        <ClipPath id="clip0_18359_145838">
          <Rect width={24} height={24} rx={12} fill="#fff" />
        </ClipPath>
        <ClipPath id="clip1_18359_145838">
          <Path fill="#fff" transform="matrix(-1 0 0 1 24 0)" d="M0 0H24V24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

const MemoPostArrowUp = React.memo(PostArrowUp);
export default MemoPostArrowUp;
