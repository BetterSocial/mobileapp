import * as React from "react";
import Svg, { Path } from "react-native-svg";

function Ic_share(props) {
  return (
    <Svg width="22" height="22" viewBox="0 0 22 22" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.5 9.167a3.65 3.65 0 01-2.03-.613l-5.087 2.458 4.928 2.546a3.667 3.667 0 11-1.166 1.461l-4.416-2.28A3.666 3.666 0 011.833 11a3.667 3.667 0 016.909-1.714l4.47-2.16A3.667 3.667 0 1116.5 9.167zm0-5.5a1.833 1.833 0 100 3.666 1.833 1.833 0 000-3.666zm-11 5.5a1.833 1.833 0 100 3.666 1.833 1.833 0 000-3.666zm9.167 7.333a1.833 1.833 0 113.666 0 1.833 1.833 0 01-3.666 0z"
        fill="#C4C4C4"
      />
    </Svg>
  );
}

const MemoIc_share = React.memo(Ic_share);
export default MemoIc_share;
