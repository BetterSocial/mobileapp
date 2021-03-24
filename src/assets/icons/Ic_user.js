import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function Ic_user(props) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 18 18" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 17.333A8.333 8.333 0 119 .666a8.333 8.333 0 010 16.667zm0-15a6.667 6.667 0 00-4.166 11.871v-.323c0-1.404.714-2.641 1.8-3.367a3.333 3.333 0 114.733 0 4.044 4.044 0 011.8 3.367v.323A6.667 6.667 0 009 2.333zm2.5 12.849V13.88A2.381 2.381 0 009.12 11.5H8.88a2.381 2.381 0 00-2.38 2.38v1.302a6.648 6.648 0 002.5.484c.883 0 1.727-.172 2.5-.484zM9 9.833A1.667 1.667 0 109 6.5a1.667 1.667 0 000 3.333z"
        fill="#000"
      />
    </Svg>
  );
}

const MemoIc_user = React.memo(Ic_user);
export default MemoIc_user;
