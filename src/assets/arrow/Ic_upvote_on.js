import * as React from 'react';
import Svg, {ClipPath, Defs, G, Path, Rect} from 'react-native-svg';
import {COLORS} from '../../utils/theme';

function IcUpvoteOn(props) {
  return (
    <Svg width="21" height="18" viewBox="0 0 21 18" fill="none" {...props}>
      <G clipPath="url(#clip0_20118_46164)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.81106 0.320318L0.438057 17.044C0.373704 17.1594 0.346102 17.2925 0.35909 17.4247C0.372078 17.5569 0.425011 17.6817 0.510526 17.7817C0.596041 17.8817 0.709888 17.952 0.836232 17.9827C0.962576 18.0134 1.09514 18.0031 1.21548 17.9531L7.65464 15.2732C9.38532 14.554 11.3219 14.554 13.0526 15.2732L19.4918 17.9508C19.6119 18.0002 19.744 18.0102 19.8698 17.9795C19.9957 17.9488 20.1092 17.8788 20.1945 17.7793C20.2798 17.6797 20.3329 17.5555 20.3463 17.4238C20.3596 17.2921 20.3327 17.1594 20.2692 17.044L10.8939 0.320318C10.8391 0.222952 10.7602 0.142078 10.6652 0.0858436C10.5701 0.0296089 10.4623 0 10.3525 0C10.2427 0 10.1348 0.0296089 10.0398 0.0858436C9.94472 0.142078 9.86583 0.222952 9.81106 0.320318V0.320318Z"
          fill={COLORS.upvote}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_20118_46164">
          <Rect width="19.998" height="18" fill="white" transform="translate(0.355957)" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default IcUpvoteOn;
