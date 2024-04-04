import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {COLORS} from '../../utils/theme';

function Ic_read(props) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 16 9" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.452 1.377a.677.677 0 10-.969-.946L8.388 6.672l-.764-.902-.952.972 1.163 1.374a.677.677 0 001.002.035l6.615-6.774zm-4.064 0a.677.677 0 10-.97-.946L4.325 6.672 1.937 3.853a.677.677 0 10-1.034.876L3.77 8.116a.677.677 0 001.002.035l6.615-6.774z"
        fill={props.fill ? props.fill : COLORS.gray400}
      />
    </Svg>
  );
}

const MemoIc_read = React.memo(Ic_read);
export default MemoIc_read;
