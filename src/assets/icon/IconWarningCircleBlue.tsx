import React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';

export default function IconWarningCircleBlue(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        opacity={1}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
        fill={props.fill || '#2F80ED'}
      />
      <Rect x={11} y={7} width={2} height={8} rx={1} fill={props.fillIcon || '#2F80ED'} />
      <Rect x={11} y={16} width={2} height={2} rx={1} fill={props.fillIcon || '#2F80ED'} />
    </Svg>
  );
}
