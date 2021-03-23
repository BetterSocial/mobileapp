import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function NewsUnselected(props) {
  return (
    <Svg width="23" height="23" viewBox="0 0 20 20" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 17.5a.5.5 0 01-.5.5H5.83c.11-.313.17-.65.17-1V2.333C6 2.15 6.15 2 6.333 2H17.5a.5.5 0 01.5.5v15zm-.5 2.5H3a3 3 0 01-3-3V5.139C0 4.509.51 4 1.139 4H4V2.333A2.333 2.333 0 016.333 0H17.5A2.5 2.5 0 0120 2.5v15a2.5 2.5 0 01-2.5 2.5zM4 6H2v11a1 1 0 102 0V6zm11 3a1 1 0 110 2H9a1 1 0 110-2h6zm1 5a1 1 0 00-1-1H9a1 1 0 100 2h6a1 1 0 001-1zm-1-9a1 1 0 110 2H9a1 1 0 010-2h6z"
        fill="#BDBDBD"
      />
    </Svg>
  );
}

const MemoNewsUnselected = React.memo(NewsUnselected);
export default MemoNewsUnselected;
