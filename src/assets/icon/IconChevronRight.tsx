import React from 'react';
import Svg, {Path} from 'react-native-svg';

export default function IconChevronRight(props) {
  return (
    <Svg
      width={8}
      height={12}
      viewBox="0 0 8 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M.91.41a.833.833 0 011.18 0l5 5a.833.833 0 010 1.18l-5 5a.833.833 0 01-1.18-1.18L5.323 6 .91 1.59a.833.833 0 010-1.18z"
        fill={props.fill || '#000'}
      />
    </Svg>
  );
}
