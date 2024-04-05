import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {COLORS} from '../../utils/theme';

function Ic_timer(props) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 16 18" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.333 2.434a.833.833 0 110-1.666h3.535a.833.833 0 110 1.666h-.934V4c0 .022 0 .043-.003.064A6.634 6.634 0 0111.088 5.4l.322-.323a.833.833 0 011.179 1.179l-.323.322a6.634 6.634 0 011.36 3.356h.874a.833.833 0 110 1.667H13.6a6.668 6.668 0 01-13.268-.935A6.668 6.668 0 016.268 4.04V2.434h-.935zM12 10.666a5 5 0 11-10 0 5 5 0 0110 0zM4.744 8.412a.833.833 0 011.178 0l1.667 1.666a.833.833 0 11-1.179 1.179L4.744 9.589a.833.833 0 010-1.178z"
        fill={props.fill || '#000'}
      />
    </Svg>
  );
}

const MemoIc_timer = React.memo(Ic_timer);
export default MemoIc_timer;
