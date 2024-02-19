import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {COLORS} from '../../utils/theme';

function Ic_question_mark(props) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 20 20" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.667 10a8.333 8.333 0 1016.666 0 8.333 8.333 0 00-16.666 0zm1.666 0a6.667 6.667 0 1113.334 0 6.667 6.667 0 01-13.334 0zM10 4.792a1 1 0 00-1 1.04l.187 4.69a.813.813 0 001.625 0L11 5.832a1 1 0 00-1-1.04zm-1.198 8.984a1.172 1.172 0 112.344 0 1.172 1.172 0 01-2.344 0z"
        fill={COLORS.gray400}
      />
    </Svg>
  );
}

const MemoIc_question_mark = React.memo(Ic_question_mark);
export default MemoIc_question_mark;
