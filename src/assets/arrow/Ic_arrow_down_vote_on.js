import * as React from "react";
import Svg, { Path } from "react-native-svg";

function Ic_arrow_down_vote_on(props) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 22 22" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.76 10.597a.917.917 0 00.1.966l6.417 8.25a.917.917 0 001.447 0l6.416-8.25a.917.917 0 00-.723-1.48h-2.75V2.75a.917.917 0 00-.917-.917h-5.5a.917.917 0 00-.917.917v7.333h-2.75c-.35 0-.67.2-.823.514zm2.698 1.32H8.25A.917.917 0 009.167 11V3.667h3.666V11c0 .506.41.917.917.917h1.793L11 17.757l-4.542-5.84z"
        fill="#FF2E63"
      />
      <Path d="M8 10.5L8.5 3h5v8H17l-6.5 8L5 11l3-.5z" fill="#FF2E63" />
    </Svg>
  );
}

const MemoIc_arrow_down_vote_on = React.memo(Ic_arrow_down_vote_on);
export default MemoIc_arrow_down_vote_on;
