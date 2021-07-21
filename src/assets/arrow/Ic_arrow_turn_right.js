import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function Ic_arrow_turn_right(props) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 20 20" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.034 1.872a.833.833 0 011.176.079l2.916 3.333a.833.833 0 010 1.097L15.21 9.715a.833.833 0 01-1.255-1.098l1.708-1.951h-2.747a9.583 9.583 0 00-9.583 9.583v1.25a.833.833 0 01-1.667 0v-1.25C1.666 10.036 6.703 5 12.916 5h2.747l-1.707-1.95a.833.833 0 01.078-1.177z"
        fill="#fff"
      />
    </Svg>
  );
}

const MemoIc_arrow_turn_right = React.memo(Ic_arrow_turn_right);
export default MemoIc_arrow_turn_right;
