import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {COLORS} from '../../utils/theme';

function Ic_arrow_left(props) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 18 18" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.966.872A.833.833 0 003.79.951L.874 4.284a.833.833 0 000 1.097L3.79 8.715a.833.833 0 001.254-1.098L3.337 5.666h2.747a9.583 9.583 0 019.583 9.583v1.25a.833.833 0 001.667 0v-1.25C17.334 9.036 12.297 4 6.084 4H3.337l1.707-1.95A.833.833 0 004.966.871z"
        fill={COLORS.blackgrey}
      />
    </Svg>
  );
}

const MemoIc_arrow_left = React.memo(Ic_arrow_left);
export default MemoIc_arrow_left;
