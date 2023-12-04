import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {COLORS} from '../../utils/theme';

function Ic_arrow_right(props) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 18 18" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.034.872a.833.833 0 011.176.079l2.916 3.333a.833.833 0 010 1.097L14.21 8.715a.833.833 0 11-1.255-1.098l1.708-1.951h-2.747a9.583 9.583 0 00-9.583 9.583v1.25a.833.833 0 01-1.667 0v-1.25C.666 9.036 5.703 4 11.916 4h2.747l-1.707-1.95a.833.833 0 01.078-1.177z"
        fill={COLORS.blackgrey}
      />
    </Svg>
  );
}

const MemoIc_arrow_right = React.memo(Ic_arrow_right);
export default MemoIc_arrow_right;
