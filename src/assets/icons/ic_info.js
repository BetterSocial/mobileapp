import * as React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';
import {COLORS} from '../../utils/theme';

function ic_info(props) {
  return (
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        opacity="0.3"
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        fill={COLORS.blue}
      />
      <Rect x="11" y="7" width="2" height="8" rx="1" fill={COLORS.blue} />
      <Rect x="11" y="16" width="2" height="2" rx="1" fill={COLORS.blue} />
    </Svg>
  );
}

const Memo_ic_info = React.memo(ic_info);
export default Memo_ic_info;
