import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function Ic_arrow_right(props) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 8 14" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M.293.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L5.586 7 .293 1.707a1 1 0 010-1.414z"
        fill={props.fill || '#000'}
      />
    </Svg>
  );
}

const MemoIc_arrow_right = React.memo(Ic_arrow_right);
export default MemoIc_arrow_right;
