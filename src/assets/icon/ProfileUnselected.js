import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function ProfileUnselected(props) {
  return (
    <Svg width="23" height="23" viewBox="0 0 20 20" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm0-18a8 8 0 00-5 14.245v-.388c0-1.684.858-3.169 2.16-4.04a4 4 0 115.68 0 4.852 4.852 0 012.16 4.04v.388A8 8 0 0010 2zm3 15.419v-1.562A2.857 2.857 0 0010.143 13h-.286A2.857 2.857 0 007 15.857v1.562c.926.375 1.94.581 3 .581s2.074-.206 3-.581zM10 11a2 2 0 100-4 2 2 0 000 4z"
        fill="#BDBDBD"
      />
    </Svg>
  );
}

const MemoProfileUnselected = React.memo(ProfileUnselected);
export default MemoProfileUnselected;
