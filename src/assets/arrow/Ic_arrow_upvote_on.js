import * as React from "react";
import Svg, { Path } from "react-native-svg";

function Ic_arrow_upvote_on(props) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 22 22" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.76 11.403a.917.917 0 01.1-.966l6.417-8.25a.917.917 0 011.447 0l6.416 8.25a.917.917 0 01-.723 1.48h-2.75v7.333a.917.917 0 01-.917.917h-5.5a.917.917 0 01-.917-.917v-7.333h-2.75c-.35 0-.67-.2-.823-.514zm2.698-1.32H8.25a.917.917 0 01.917.917v7.333h3.666V11c0-.506.41-.917.917-.917h1.793L11 4.243l-4.542 5.84z"
        fill="#00ADB5"
      />
      <Path d="M5.5 11L11 3.5l6 7-3 .5v8.5H8.5V11h-3z" fill="#00ADB5" />
    </Svg>
  );
}

const MemoIc_arrow_upvote_on = React.memo(Ic_arrow_upvote_on);
export default MemoIc_arrow_upvote_on;
