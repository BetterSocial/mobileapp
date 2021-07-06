import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function Ic_downvote_on(props) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 20 17" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.542 16.698L19.918.903a.587.587 0 00-.073-.697.646.646 0 00-.705-.162L12.7 2.575a7.409 7.409 0 01-5.4 0L.86.047a.645.645 0 00-.704.162.594.594 0 00-.075.694L9.46 16.698a.614.614 0 00.229.221.642.642 0 00.854-.221z"
        fill="#FF2E63"
      />
    </Svg>
  );
}

const MemoIc_downvote_on = React.memo(Ic_downvote_on);
export default MemoIc_downvote_on;
