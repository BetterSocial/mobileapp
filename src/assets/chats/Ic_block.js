import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function Ic_block(props) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 20 20" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20 10c0 5.523-4.477 10-10 10S0 15.523 0 10 4.477 0 10 0s10 4.477 10 10zm-5.094-6.32A8 8 0 003.68 14.905L14.905 3.68zm1.414 1.414A8 8 0 015.095 16.32L16.32 5.094z"
        fill="#828282"
      />
    </Svg>
  );
}

const MemoIc_block = React.memo(Ic_block);
export default MemoIc_block;
