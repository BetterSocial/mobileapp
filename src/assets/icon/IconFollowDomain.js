import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {COLORS} from '../../utils/theme';

function IconFollowDomain(props) {
  return (
    <Svg width="18" height="18" viewBox="0 0 18 18" fill="none" {...props}>
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M10.1943 1.11509C10.1943 0.499245 9.6951 0 9.07925 0C8.4634 0 7.96415 0.499245 7.96415 1.11509L7.96415 7.80566L1.1151 7.80566C0.499245 7.80566 0 8.3049 0 8.92075C0 9.5366 0.499245 10.0358 1.11509 10.0358H7.96415L7.96415 16.8849C7.96415 17.5008 8.4634 18 9.07924 18C9.6951 18 10.1943 17.5008 10.1943 16.8849L10.1943 10.0358H16.8849C17.5008 10.0358 18 9.5366 18 8.92075C18 8.3049 17.5008 7.80566 16.8849 7.80566L10.1943 7.80566L10.1943 1.11509Z"
        fill={COLORS.signed_primary}
      />
    </Svg>
  );
}

const MemoFollowDomain = React.memo(IconFollowDomain);
export default MemoFollowDomain;
