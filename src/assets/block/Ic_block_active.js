import * as React from "react";
import Svg, { Path, Circle } from "react-native-svg";

function Ic_block_active(props) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 22 22" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20 11a9.167 9.167 0 11-18.333 0A9.167 9.167 0 0120 11zm-4.67-5.793a7.333 7.333 0 00-10.29 10.29l10.29-10.29zm1.296 1.296a7.333 7.333 0 01-10.29 10.29l10.29-10.29z"
        fill="#FF2E63"
      />
      <Circle cx={11} cy={11} r={8} fill="#FF2E63" />
      <Path d="M5.5 16L16 6" stroke="#fff" strokeWidth={2} />
    </Svg>
  );
}

const MemoIc_block_active = React.memo(Ic_block_active);
export default MemoIc_block_active;
