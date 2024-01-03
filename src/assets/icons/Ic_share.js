import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {COLORS} from '../../utils/theme';

/**
 * @typedef {Object} IconShare
 * @property {string} color
 * @property {number} height
 * @property {number} width
 */

/**
 *
 * @param {IconShare} props
 */

function Ic_share(props) {
  return (
    <Svg width="23.5" height="23.5" viewBox="0 0 23.5 23.5" fill="none" {...props}>
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M6.28655 7.3902C5.89956 7.78423 5.90527 8.41737 6.29929 8.80436C6.69332 9.19135 7.32646 9.18565 7.71345 8.79162L11 5.44531V15C11 15.5523 11.4477 16 12 16C12.5523 16 13 15.5523 13 15V5.44531L16.2866 8.79162C16.6735 9.18565 17.3067 9.19135 17.7007 8.80436C18.0947 8.41737 18.1004 7.78423 17.7134 7.3902L12.7134 2.29929C12.5254 2.10785 12.2683 2 12 2C11.7317 2 11.4746 2.10785 11.2866 2.29929L6.28655 7.3902ZM4 12C4 11.4477 3.55228 11 3 11C2.44772 11 2 11.4477 2 12V21C2 21.5523 2.44772 22 3 22H21C21.5523 22 22 21.5523 22 21V12C22 11.4477 21.5523 11 21 11C20.4477 11 20 11.4477 20 12V20H4V12Z"
        fill={props.color || COLORS.balance_gray}
      />
    </Svg>
  );
}

const MemoIc_share = React.memo(Ic_share);
export default MemoIc_share;
