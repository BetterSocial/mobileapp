import * as React from "react";
import Svg, { Path } from "react-native-svg";

function Ic_arrow_upvote_off(props) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 19 18" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.826 9.33a.75.75 0 01.082-.79l5.25-6.75a.75.75 0 011.184 0l5.25 6.75A.75.75 0 0115 9.75h-2.25v6a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75v-6H4.5a.75.75 0 01-.674-.42zm2.207-1.08H7.5a.75.75 0 01.75.75v6h3V9a.75.75 0 01.75-.75h1.466L9.75 3.472 6.033 8.25z"
        fill="#C4C4C4"
      />
    </Svg>
  );
}

const MemoIc_arrow_upvote_off = React.memo(Ic_arrow_upvote_off);
export default MemoIc_arrow_upvote_off;
