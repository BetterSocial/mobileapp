import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function Ic_emoji(props) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 20 20" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 10c0 5.523 4.477 10 10 10s10-4.477 10-10S15.523 0 10 0 0 4.477 0 10zm2 0a8 8 0 1116 0 8 8 0 01-16 0zm5 1a1 1 0 10-2 0 5 5 0 0010 0 1 1 0 10-2 0 3 3 0 11-6 0zM6 8a1 1 0 001-1 1 1 0 002 0 2 2 0 10-4 0 1 1 0 001 1zm7-1a1 1 0 11-2 0 2 2 0 114 0 1 1 0 11-2 0z"
        fill="#C4C4C4"
      />
    </Svg>
  );
}

const MemoIc_emoji = React.memo(Ic_emoji);
export default MemoIc_emoji;
