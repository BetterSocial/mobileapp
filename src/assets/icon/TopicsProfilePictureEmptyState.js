import * as React from 'react';
import Svg, {Path, Rect, G, ClipPath} from 'react-native-svg';

import TestIdConstant from '../../utils/testId';

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
        <Rect width="48" height="48" rx="24" fill="#E0E0E0" />
        <Rect width="48" height="48" rx="24" fill="#2C67BC" />
        <Path
          d="M24.4585 33L27.3221 15.5455H29.3676L26.5039 33H24.4585ZM16.5579 28.3295L16.8903 26.2841H30.1176L29.7852 28.3295H16.5579ZM18.3221 33L21.1857 15.5455H23.2312L20.3676 33H18.3221ZM17.5721 22.2614L17.9045 20.2159H31.1318L30.7994 22.2614H17.5721Z"
          fill="white"
        />
      </G>
      <ClipPath id="clip0_14506_82693">
        <Rect width="48" height="48" rx="24" fill="white" />
      </ClipPath>
    </Svg>
  );
}

export default TopicsProfilePictureEmptyState;
