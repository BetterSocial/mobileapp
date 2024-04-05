import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function Ic_hastag(props) {
  return (
    <Svg width={18} height={18} fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.834 16.5a.833.833 0 101.666 0v-3.333h5V16.5a.833.833 0 101.667 0v-3.333H16.5a.833.833 0 100-1.667h-3.333v-5H16.5a.833.833 0 100-1.666h-3.333V1.5a.833.833 0 10-1.667 0v3.334h-5V1.5a.833.833 0 10-1.666 0v3.334H1.5a.833.833 0 000 1.666h3.334v5H1.5a.833.833 0 000 1.667h3.334V16.5zM6.5 6.5v5h5v-5h-5z"
        fill={props.fill || '#000'}
      />
    </Svg>
  );
}

const MemoIc_hastag = React.memo(Ic_hastag);
export default MemoIc_hastag;
