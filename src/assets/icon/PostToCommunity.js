import * as React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';
import {COLORS} from '../../utils/theme';

const PostToCommunity = (props) => (
  <Svg
    width={32}
    height={28}
    viewBox="-1 5 50 70"
    fill="none"
    preserveAspectRatio="xMinYMin meet"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Rect x={2.5} y={17.499} width={62.5} height={50} rx={10} stroke="#fff" strokeWidth={5} />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18.333 54.166a1.667 1.667 0 1 0 3.334 0v-5h6.666v5a1.667 1.667 0 1 0 3.334 0v-5h5a1.667 1.667 0 1 0 0-3.333h-5v-6.667h5a1.667 1.667 0 0 0 0-3.333h-5v-5a1.667 1.667 0 1 0-3.334 0v5h-6.666v-5a1.667 1.667 0 1 0-3.334 0v5h-5a1.667 1.667 0 1 0 0 3.333h5v6.667h-5a1.667 1.667 0 1 0 0 3.333h5v5Zm3.334-15v6.667h6.666v-6.667h-6.666Z"
      fill="#fff"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M63.822 6.13a3.861 3.861 0 0 1 5.46 0l4.587 4.588a3.861 3.861 0 0 1 0 5.46L54.844 35.205a3.861 3.861 0 0 1-1.964 1.054l-5.752 1.165a3.861 3.861 0 0 1-4.551-4.55l1.165-5.753a3.861 3.861 0 0 1 1.054-1.964L63.822 6.131ZM47.192 29.532l.208-1.023 4.09 4.092-1.022.207-4.108.832.832-4.108Zm7.277.587-4.587-4.588L63.82 11.591l2.73-2.73 1.858 1.857.873.873 1.857 1.857-2.73 2.73-13.939 13.94Z"
      fill="#fff"
      stroke={COLORS.darkBlue}
      strokeWidth={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M63.822 6.13a3.861 3.861 0 0 1 5.46 0l4.587 4.588a3.861 3.861 0 0 1 0 5.46L54.844 35.205a3.861 3.861 0 0 1-1.964 1.054l-5.752 1.165a3.861 3.861 0 0 1-4.551-4.55l1.165-5.753a3.861 3.861 0 0 1 1.054-1.964L63.822 6.131ZM47.192 29.532l.208-1.023 4.09 4.092-1.022.207-4.108.832.832-4.108Zm7.277.587-4.587-4.588L63.82 11.591l2.73-2.73 1.858 1.857.873.873 1.857 1.857-2.73 2.73-13.939 13.94Z"
      fill="#fff"
    />
  </Svg>
);

export default PostToCommunity;
