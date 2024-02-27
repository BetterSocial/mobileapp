import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function Ic_Checklist(props) {
  return (
    <Svg width={24} height={24} fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 12c0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 2 12 2 2 6.477 2 12zm2 0a8 8 0 1116 0 8 8 0 01-16 0z"
        fill={props.color || '#00ADB5'}
      />
      <Path
        d="M16.737 9.676a1 1 0 10-1.474-1.352l-4.727 5.157-1.768-2.121a1 1 0 10-1.536 1.28l2.5 3a1 1 0 001.505.036l5.5-6z"
        fill={props.color || '#00ADB5'}
      />
    </Svg>
  );
}

const MemoIc_Checklist = React.memo(Ic_Checklist);
export default MemoIc_Checklist;
