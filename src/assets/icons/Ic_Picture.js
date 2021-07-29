import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function Ic_Picture(props) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 20 20" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 2a2 2 0 012-2h16a2 2 0 012 2v16a2 2 0 01-2 2H2a2 2 0 01-2-2v-2.999V2zm2 13.423V18h16v-4.252l-2.986-3.308-5.443 5.278a1 1 0 01-1.284.09l-3.82-2.777L2 15.423zm16-4.66L15.805 8.33a1 1 0 00-1.439-.048l-5.583 5.415-3.82-2.778a1 1 0 00-1.284.09L2 12.637V2h16v8.763zM7 6.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"
        fill="#C4C4C4"
      />
    </Svg>
  );
}

const MemoIc_Picture = React.memo(Ic_Picture);
export default MemoIc_Picture;
