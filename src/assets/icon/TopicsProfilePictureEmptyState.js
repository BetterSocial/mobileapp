import * as React from 'react';
import Svg, {Path, Rect, G, ClipPath, Defs} from 'react-native-svg';

import TestIdConstant from '../../utils/testId';
import {COLORS} from '../../utils/theme';

function TopicsProfilePictureEmptyState(props) {
  return (
    <Svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      testID={TestIdConstant.iconDomainProfilePictureEmptyState}
      {...props}>
      <G clipPath="url(#clip0_14506_82693)">
        <Rect width="48" height="48" rx="24" fill={COLORS.white} />
        <Rect width="48" height="48" rx="24" fill={COLORS.signed_primary} />
        <Path
          d="M24.6179 32.7L27.4815 15.2454H29.527L26.6634 32.7H24.6179ZM16.7173 28.0295L17.0497 25.984H30.277L29.9446 28.0295H16.7173ZM18.4815 32.7L21.3452 15.2454H23.3906L20.527 32.7H18.4815ZM17.7315 21.9613L18.0639 19.9159H31.2912L30.9588 21.9613H17.7315Z"
          fill="white"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_14506_82693">
          <Rect width="48" height="48" rx="24" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default TopicsProfilePictureEmptyState;
