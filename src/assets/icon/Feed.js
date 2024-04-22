import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import dimen from '../../utils/dimen';

function Feed(props) {
  return (
    <Svg
      width={dimen.normalizeDimen(20)}
      height={dimen.normalizeDimen(20)}
      viewBox="0 0 20 20"
      fill="none"
      {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14 20C15.6569 20 17 18.6569 17 17C18.6569 17 20 15.6569 20 14V6C20 4.34314 18.6569 3 17 3C17 1.34315 15.6569 0 14 0H6C4.34315 0 3 1.34315 3 3C1.34314 3 0 4.34315 0 6V14C0 15.6569 1.34315 17 3 17C3 18.6569 4.34315 20 6 20H14ZM5 5L3 5C2.44771 5 2 5.44771 2 6L2 14C2 14.5523 2.44771 15 3 15L5 15L15 15L17 15C17.5523 15 18 14.5523 18 14V6C18 5.44771 17.5523 5 17 5L15 5H5ZM15 3H5C5 2.44771 5.44772 2 6 2H14C14.5523 2 15 2.44772 15 3ZM6 18C5.44772 18 5 17.5523 5 17L15 17C15 17.5523 14.5523 18 14 18L6 18Z"
      />
    </Svg>
  );
}

const MemoFeed = React.memo(Feed);
export default MemoFeed;
