import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {COLORS} from '../../utils/theme';

function IcUpvoteOn(props) {
  return (
    <Svg width="22" height="22" viewBox="0 0 22 22" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.086 19.0438L10.4579 2.32211C10.5127 2.22476 10.5915 2.14389 10.6866 2.08766C10.7816 2.03144 10.8895 2.00183 10.9992 2.00183C11.0278 2.00183 11.0562 2.00383 11.0843 2.00779C11.1655 2.01873 11.2441 2.04594 11.3155 2.08815C11.4105 2.14438 11.4894 2.22525 11.5441 2.3226L18.1433 14.1001L20.9148 19.0438C20.9783 19.1592 21.0052 19.2919 20.9918 19.4236C20.9785 19.5553 20.9254 19.6795 20.8401 19.779C20.7548 19.8785 20.6413 19.9485 20.5155 19.9792C20.3896 20.0099 20.2575 19.9999 20.1375 19.9505L13.6991 17.2732C11.9906 16.5632 10.0813 16.5542 8.36771 17.2462C8.34175 17.2581 8.3201 17.2681 8.30296 17.276L8.25438 17.2974L3.36343 19.3285L1.86332 19.9528C1.743 20.0028 1.61045 20.0131 1.48412 19.9824C1.35779 19.9517 1.24396 19.8814 1.15846 19.7814C1.07295 19.6814 1.02003 19.5567 1.00704 19.4245C0.994052 19.2923 1.02165 19.1592 1.086 19.0438Z"
        fill={COLORS.upvote}
      />
    </Svg>
  );
}

export default IcUpvoteOn;
