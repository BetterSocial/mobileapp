import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {COLORS} from '../../utils/theme';

function CommentReply(props) {
  return (
    <Svg width="16" height="16" viewBox="0 0 16 16" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.06232 0.319857C3.73501 0.0334571 3.2375 0.0666244 2.9511 0.393938L0.194845 3.54394C-0.064949 3.84085 -0.064949 4.28417 0.194845 4.58108L2.9511 7.73108C3.2375 8.0584 3.73501 8.09156 4.06232 7.80516C4.38964 7.51876 4.4228 7.02125 4.1364 6.69394L2.52297 4.85001L5.11875 4.85001C10.1204 4.85001 14.175 8.90461 14.175 13.9062L14.175 15.0875C14.175 15.5224 14.5276 15.875 14.9625 15.875C15.3974 15.875 15.75 15.5224 15.75 15.0875L15.75 13.9062C15.75 8.03475 10.9902 3.27501 5.11875 3.27501L2.52297 3.27501L4.1364 1.43108C4.4228 1.10377 4.38964 0.606256 4.06232 0.319857Z"
        fill={COLORS.gray1}
      />
    </Svg>
  );
}

const MemoCommentReply = React.memo(CommentReply);
export default MemoCommentReply;
