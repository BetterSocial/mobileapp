import * as React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';

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

function Ic_share_circle(props) {
  return (
    <Svg width={32} height={32} viewBox="0 0 32 32" fill="none" {...props}>
      <Rect width={32} height={32} rx={16} fill="#000" fillOpacity={0.6} />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M11.43 12.312a.8.8 0 101.14 1.121l2.63-2.677V18.4a.8.8 0 001.6 0v-7.644l2.63 2.677a.8.8 0 001.14-1.12l-4-4.074a.8.8 0 00-1.14 0l-4 4.073zM9.6 16A.8.8 0 008 16v7.2a.8.8 0 00.8.8h14.4a.8.8 0 00.8-.8V16a.8.8 0 00-1.6 0v6.4H9.6V16z"
        fill="#fff"
      />
    </Svg>
  );
}

const MemoIc_share_circle = React.memo(Ic_share_circle);
export default MemoIc_share_circle;
