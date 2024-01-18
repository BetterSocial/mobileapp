import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {COLORS} from '../../utils/theme';

function Ic_block_inactive(props) {
  return (
    <Svg width="22" height="22" viewBox="0 0 22 22" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20 11a9.167 9.167 0 11-18.333 0A9.167 9.167 0 0120 11zm-4.67-5.793a7.333 7.333 0 00-10.29 10.29l10.29-10.29zm1.296 1.296a7.333 7.333 0 01-10.29 10.29l10.29-10.29z"
        fill={props.color || COLORS.gray400}
      />
    </Svg>
  );
}

const MemoIc_block_inactive = React.memo(Ic_block_inactive);
export default MemoIc_block_inactive;
