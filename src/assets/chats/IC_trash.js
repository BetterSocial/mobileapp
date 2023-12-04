import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {COLORS} from '../../utils/theme';

function IC_trash(props) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 18 20" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.26 3H13a3 3 0 00-3-3H8a3 3 0 00-3 3H1a1 1 0 000 2h1v12a3 3 0 003 3h8a3 3 0 003-3V5h1a1 1 0 100-2h-3.74zM14 5H4v12a1 1 0 001 1h8a1 1 0 001-1V5zM7 3h4a1 1 0 00-1-1H8a1 1 0 00-1 1zm0 4a1 1 0 011 1v7a1 1 0 11-2 0V8a1 1 0 011-1zm5 1a1 1 0 10-2 0v7a1 1 0 102 0V8z"
        fill={COLORS.blackgrey}
      />
    </Svg>
  );
}

const MemoIC_trash = React.memo(IC_trash);
export default MemoIC_trash;
