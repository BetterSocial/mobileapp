import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {COLORS} from '../../utils/theme';

function Ic_pencil(props) {
  return (
    <Svg
      width={30}
      height={30}
      viewBox={`0 0 ${20} ${20}`}
      fill="none"
      {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.4467 1.01337C14.1963 0.263774 15.4116 0.263774 16.1612 1.01337L18.9862 3.83834C19.7358 4.58793 19.7358 5.80326 18.9862 6.55285L7.27052 18.2685C7.00371 18.5353 6.66417 18.7176 6.29435 18.7925L2.75174 19.5102C2.1211 19.6379 1.46839 19.4412 1.0134 18.9862C0.558406 18.5312 0.361663 17.8785 0.489414 17.2478L1.20705 13.7052C1.28197 13.3354 1.46422 12.9959 1.73103 12.729L13.4467 1.01337ZM2.78436 15.5867L2.90778 14.9774L5.02218 17.0918L4.4129 17.2152L2.37065 17.6289L2.78436 15.5867ZM6.73473 16.0898L3.90975 13.2648L12.1497 5.02485L14.9747 7.84982L6.73473 16.0898ZM16.332 6.49257L17.6289 5.1956L16.2717 3.83834L16.1612 3.72788L14.804 2.37062L13.507 3.66759L16.332 6.49257Z"
        fill={props.color ? props.color : COLORS.holyTosca}
      />
    </Svg>
  );
}

const MemoIc_pencil = React.memo(Ic_pencil);
export default MemoIc_pencil;
