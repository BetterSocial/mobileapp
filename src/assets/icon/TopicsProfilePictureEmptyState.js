import * as React from 'react';
import Svg, {Path, Rect, G, ClipPath, Defs} from 'react-native-svg';

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
        <Rect width="48" height="48" rx="24" fill="#2F80ED" />
        <Path
          d="M24.4585 30L27.3221 12.5455H29.3676L26.5039 30H24.4585ZM16.5579 25.3295L16.8903 23.2841H30.1176L29.7852 25.3295H16.5579ZM18.3221 30L21.1857 12.5455H23.2312L20.3676 30H18.3221ZM17.5721 19.2614L17.9045 17.2159H31.1318L30.7994 19.2614H17.5721Z"
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
