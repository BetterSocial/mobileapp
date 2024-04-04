import * as React from 'react';
import Svg, {ClipPath, Defs, G, Path, Rect} from 'react-native-svg';
import {COLORS} from '../../utils/theme';

function IcDownVoteOff(props) {
  return (
    <Svg width="21" height="18" viewBox="0 0 21 18" fill="none" {...props}>
      <G clipPath="url(#clip0_20118_46161)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.6093 2.70267L7.65789 2.72397C7.67504 2.73194 7.69669 2.74195 7.72265 2.75387C9.43646 3.44593 11.3459 3.43692 13.0546 2.72683L19.4938 0.0492388C19.6139 -0.000171182 19.746 -0.0102069 19.8718 0.0205127C19.9977 0.0512341 20.1112 0.121196 20.1965 0.220737C20.2819 0.320277 20.3349 0.444481 20.3483 0.576185C20.3617 0.707892 20.3347 0.8406 20.2712 0.955974L10.8995 17.6792C10.8447 17.7766 10.7658 17.8574 10.6707 17.9137C10.5994 17.9559 10.5208 17.9831 10.4396 17.994C10.4115 17.998 10.383 18 10.3545 18C10.2447 18 10.1368 17.9704 10.0418 17.9142C9.94674 17.8579 9.86785 17.777 9.81307 17.6797L0.440071 0.955974C0.375718 0.84056 0.348116 0.707493 0.361104 0.575283C0.374092 0.443073 0.427025 0.318291 0.51254 0.21829C0.598055 0.118289 0.711902 0.0480428 0.838246 0.0173194C0.96459 -0.0134021 1.09715 -0.0030726 1.21749 0.0468715L7.6093 2.70267ZM6.96582 4.38921L3.65835 3.01265L10.3564 14.9607L14.7901 7.05173C13.7191 6.86052 12.5881 6.5386 11.5532 6.19627C9.45421 5.50199 7.5612 4.65957 7.00816 4.40668C6.99404 4.4009 6.97992 4.39507 6.96582 4.38921ZM15.7307 5.37405L17.054 3.01342L13.7458 4.38906C13.4446 4.51426 13.1379 4.62226 12.828 4.71274C13.826 5.01672 14.8372 5.26532 15.7307 5.37405Z"
          fill={props.color || COLORS.gray400}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_20118_46161">
          <Rect width="19.998" height="18" fill="white" transform="translate(0.357971)" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default IcDownVoteOff;
