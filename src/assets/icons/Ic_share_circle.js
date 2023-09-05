import * as React from 'react';
import {Platform} from 'react-native';
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
  const isIos = Platform.OS === 'ios';
  if (isIos) {
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

  return (
    <Svg width="22" height="22" viewBox="0 0 22 22" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.5 9.167a3.65 3.65 0 01-2.03-.613l-5.087 2.458 4.928 2.546a3.667 3.667 0 11-1.166 1.461l-4.416-2.28A3.666 3.666 0 011.833 11a3.667 3.667 0 016.909-1.714l4.47-2.16A3.667 3.667 0 1116.5 9.167zm0-5.5a1.833 1.833 0 100 3.666 1.833 1.833 0 000-3.666zm-11 5.5a1.833 1.833 0 100 3.666 1.833 1.833 0 000-3.666zm9.167 7.333a1.833 1.833 0 113.666 0 1.833 1.833 0 01-3.666 0z"
        fill={props.color || '#C4C4C4'}
      />
    </Svg>
  );
}

const MemoIc_share_circle = React.memo(Ic_share_circle);
export default MemoIc_share_circle;
