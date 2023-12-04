import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {COLORS} from '../../../utils/theme';

function IconClose(props) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"
        fill={COLORS.blackgrey}
        stroke="#F2F2F2"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15.707 8.293a1 1 0 010 1.414L13.414 12l2.293 2.293a1 1 0 01-1.414 1.414L12 13.414l-2.293 2.293a1 1 0 01-1.414-1.414L10.586 12 8.293 9.707a1 1 0 011.414-1.414L12 10.586l2.293-2.293a1 1 0 011.414 0z"
        fill="#fff"
      />
    </Svg>
  );
}

const MemoIconClose = React.memo(IconClose);
export default MemoIconClose;
