import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function Ic_upvote_on(props) {
  return (
    <Svg width="20" height="17" viewBox="0 0 20 17" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.458.303L.082 16.097a.587.587 0 00.073.697.645.645 0 00.705.162L7.3 14.425a7.408 7.408 0 015.4 0l6.44 2.528a.645.645 0 00.704-.162.593.593 0 00.075-.694L10.54.303a.615.615 0 00-.229-.222.642.642 0 00-.854.222z"
        fill="#00ADB5"
      />
    </Svg>
  );
}

const MemoIc_upvote_on = React.memo(Ic_upvote_on);
export default MemoIc_upvote_on;
