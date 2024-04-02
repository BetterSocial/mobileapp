import * as React from 'react';
import Svg, {Path, G, Rect, Defs, ClipPath} from 'react-native-svg';

function IconClose(props) {
  return (
    <Svg
      width={16}
      height={17}
      viewBox="0 0 16 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <G clipPath="url(#clip0_20145_91485)">
        <Rect y={0.5} width={16} height={16} rx={8} fill={props.fill || '#4782D7'} />
        <G clipPath="url(#clip1_20145_91485)">
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8 16.5a8 8 0 110-16 8 8 0 010 16zM8 2.1a6.4 6.4 0 100 12.8A6.4 6.4 0 008 2.1zm2.966 3.434a.8.8 0 010 1.132L9.13 8.5l1.835 1.834a.8.8 0 01-1.132 1.132L8 9.63l-1.834 1.835a.8.8 0 01-1.132-1.132L6.87 8.5 5.034 6.666a.8.8 0 011.132-1.132L8 7.37l1.834-1.835a.8.8 0 011.132 0z"
            fill="#fff"
          />
        </G>
      </G>
      <Defs>
        <ClipPath id="clip0_20145_91485">
          <Rect y={0.5} width={16} height={16} rx={8} fill="#fff" />
        </ClipPath>
        <ClipPath id="clip1_20145_91485">
          <Path fill="#fff" transform="translate(0 .5)" d="M0 0H16V16H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

const MemoIconClose = React.memo(IconClose);
export default MemoIconClose;
