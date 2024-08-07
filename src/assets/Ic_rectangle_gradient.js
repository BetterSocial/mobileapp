import * as React from 'react';
import Svg, {Rect, Defs, LinearGradient, Stop} from 'react-native-svg';

function Ic_rectangle_gradient(props) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 182 6" fill="none" {...props}>
      <Rect
        width={181.667}
        height={6}
        rx={2.5}
        fill="url(#prefix__paint0_linear)"
      />
      <Defs>
        <LinearGradient
          id="prefix__paint0_linear"
          x1={0}
          y1={2.5}
          x2={181.667}
          y2={2.5}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#17CB80" />
          <Stop offset={0.526} stopColor="#F0F414" />
          <Stop offset={0.802} stopColor="#FEF515" />
          <Stop offset={1} stopColor="#E62F1D" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}

const MemoIc_rectangle_gradient = React.memo(Ic_rectangle_gradient);
export default MemoIc_rectangle_gradient;
