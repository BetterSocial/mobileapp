import * as React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';
import {COLORS} from '../../utils/theme';

const IconCheck = (props) => (
  <Svg width={32} height={32} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <Rect width={32} height={32} rx={16} fill={COLORS.signed_primary} />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M23.699 10.285a1 1 0 0 1 .016 1.414l-9.765 10a1 1 0 0 1-1.479-.053l-4.234-5a1 1 0 0 1 1.526-1.292l3.524 4.16 8.998-9.213a1 1 0 0 1 1.414-.016Z"
      fill={COLORS.white}
    />
  </Svg>
);

export default IconCheck;
