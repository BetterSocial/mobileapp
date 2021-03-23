import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function FeedUnselected(props) {
  return (
    <Svg width="23" height="23" viewBox="0 0 20 20" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 14a3 3 0 003 3 3 3 0 003 3h8a3 3 0 003-3 3 3 0 003-3V6a3 3 0 00-3-3 3 3 0 00-3-3H6a3 3 0 00-3 3 3 3 0 00-3 3v8zm15-9V3a1 1 0 00-1-1H6a1 1 0 00-1 1v14a1 1 0 001 1h8a1 1 0 001-1V5zm2 10V5a1 1 0 011 1v8a1 1 0 01-1 1zM2 6a1 1 0 011-1v10a1 1 0 01-1-1V6z"
        fill="#BDBDBD"
      />
    </Svg>
  );
}

const MemoFeedUnselected = React.memo(FeedUnselected);
export default MemoFeedUnselected;
