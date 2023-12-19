import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {colors} from '../../utils/colors';

function IconUnfollowDomain(props) {
  return (
    <Svg width="18" height="18" viewBox="0 0 16 12" fill="none" {...props}>
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M15.6987 0.284559C16.0938 0.670426 16.1013 1.30355 15.7155 1.69867L5.94984 11.6987C5.75306 11.9002 5.48044 12.0093 5.19897 11.9994C4.91751 11.9894 4.6533 11.8612 4.47128 11.6463L0.236906 6.64626C-0.120015 6.22481 -0.0676986 5.59381 0.353758 5.23689C0.775215 4.87996 1.40621 4.93228 1.76314 5.35374L5.28704 9.51481L14.2846 0.301327C14.6704 -0.0937997 15.3036 -0.101307 15.6987 0.284559Z" 
        fill="white"
      />
    </Svg>
  );
}

const MemoUnfollowDomain = React.memo(IconUnfollowDomain);
export default MemoUnfollowDomain;
