import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function Ic_arrow_down_vote_off(props) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 19 18" fill="#FF2E63" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.826 8.67a.75.75 0 00.082.79l5.25 6.75a.75.75 0 001.184 0l5.25-6.75A.75.75 0 0015 8.25h-2.25v-6A.75.75 0 0012 1.5H7.5a.75.75 0 00-.75.75v6H4.5a.75.75 0 00-.674.42zm2.207 1.08H7.5A.75.75 0 008.25 9V3h3v6c0 .414.336.75.75.75h1.466L9.75 14.528 6.033 9.75z"
        fill="#FF2E63"
      />
    </Svg>
  );
}

const MemoIc_arrow_down_vote_off = React.memo(Ic_arrow_down_vote_off);
export default MemoIc_arrow_down_vote_off;
