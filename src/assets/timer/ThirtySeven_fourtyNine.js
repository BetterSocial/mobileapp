import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {COLORS} from '../../utils/theme';

function ThirtySeven_fourtyNine(props) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.667 2.748a.667.667 0 010-1.334h2.828a.667.667 0 010 1.334h-.748V4c0 .017 0 .035-.002.052.944.132 1.808.51 2.526 1.068l.258-.258a.667.667 0 11.943.943l-.259.258c.59.758.979 1.68 1.089 2.685H14a.667.667 0 110 1.333h-.719a5.334 5.334 0 11-5.866-6.05V2.749h-.748zM12 9.333a4 4 0 11-8 0 4 4 0 018 0z"
        fill={props.fill || COLORS.gray410}
      />
      <Path d="M8 4.8a4.5 4.5 0 103.182 7.682L8 9.3V4.8z" fill={props.fill || COLORS.gray410} />
    </Svg>
  );
}

const MemoThirtySeven_fourtyNine = React.memo(ThirtySeven_fourtyNine);
export default MemoThirtySeven_fourtyNine;
