import * as React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';

const PostToCommunity = (props) => (
  <Svg
    width={32}
    height={28}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-2 2 32 28"
    {...props}>
    <Rect x={1} y={7} width={25} height={20} rx={4} stroke="#fff" strokeWidth={2} />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.334 21.666a.667.667 0 1 0 1.333 0v-2h2.667v2a.667.667 0 1 0 1.333 0v-2h2a.667.667 0 0 0 0-1.333h-2v-2.667h2a.667.667 0 0 0 0-1.333h-2v-2a.667.667 0 0 0-1.333 0v2H8.667v-2a.667.667 0 1 0-1.333 0v2h-2a.667.667 0 0 0 0 1.333h2v2.667h-2a.667.667 0 0 0 0 1.333h2v2Zm1.333-6v2.667h2.667v-2.667H8.667Z"
      fill="#fff"
    />
    <Path
      d="m17.49 10.847-.973-.198c.1-.49.34-.94.694-1.294l7.61-7.61a2.544 2.544 0 0 1 3.599 0l1.835 1.835a2.544 2.544 0 0 1 0 3.599l-7.61 7.61a2.544 2.544 0 0 1-1.294.694l-.19-.937.19.937-2.301.466a2.544 2.544 0 0 1-2.305-.694m.746-4.408-.746 4.408m.746-4.408-.974-.198-.466 2.301c-.17.836.091 1.702.694 2.305m.746-4.408-.746 4.408m0 0 .707-.707-.707.707Zm9.911-9.49-4.868 4.868-.42-.421 4.868-4.868.385-.385.035.035.35.35.035.035-.385.385Z"
      fill="#fff"
      stroke="#00ADB5"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default PostToCommunity;
