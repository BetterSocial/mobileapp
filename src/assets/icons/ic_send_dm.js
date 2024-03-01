import * as React from 'react';
import Svg, {Path, G, Defs, ClipPath, Rect} from 'react-native-svg';

/**
 * @typedef {Object} IconShare
 * @property {string} color
 * @property {number} height
 * @property {number} width
 */

/**
 * @param {IconShare} props
 */
function Ic_senddm(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || 18}
      height={props.height || 18}
      viewBox="0 0 18 18"
      fill="none">
      <G clipPath="url(#clip0_17210_245364)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M17.7592 0.317172C18.0105 0.615821 18.0728 1.05431 17.9167 1.42447L11.166 17.4244C11.0281 17.7513 10.7423 17.9702 10.4183 17.9972C10.0943 18.0242 9.78233 17.8551 9.60209 17.5547L7.92654 14.7624L5.39705 16.3682C5.11847 16.5451 4.77622 16.5438 4.49871 16.3649C4.2212 16.186 4.0504 15.8565 4.0504 15.5V10.6499L0.534529 8.91383C0.202411 8.74983 -0.00834699 8.38002 0.000253655 7.97635C0.0088543 7.57268 0.235126 7.21436 0.573856 7.06801L16.7754 0.068032C17.1184 -0.0801368 17.508 0.0185235 17.7592 0.317172ZM5.85057 11.618L6.13433 11.7757L6.92561 13.0943L5.85057 13.7768V11.618ZM7.93883 11.1773L10.2139 14.9688L14.4798 4.85821L7.93883 11.1773ZM12.611 4.0132L3.24097 8.06158L5.31604 9.0862C5.3285 9.09235 5.34083 9.09882 5.35302 9.10559L6.61451 9.80635L12.611 4.0132Z"
          fill={props.color || '#9B9FA9'}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_17210_245364">
          <Rect width="18" height="18" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

const MemoIc_senddm = React.memo(Ic_senddm);
export default MemoIc_senddm;
