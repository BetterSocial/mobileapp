import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function Ic_search(props) {
  return (
    <Svg
      width="1em"
      height="1em"
      viewBox="0 0 16.67 16.67"
      fill="none"
      {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.667 7.917a6.25 6.25 0 0010.08 4.94.83.83 0 00.164.232l5 5a.834.834 0 001.178-1.178l-5-5a.833.833 0 00-.233-.165 6.25 6.25 0 10-11.19-3.83zm1.666 0a4.583 4.583 0 119.167 0 4.583 4.583 0 01-9.167 0z"
        fill="#000"
      />
    </Svg>
  );
}

const MemoIc_search = React.memo(Ic_search);
export default MemoIc_search;
