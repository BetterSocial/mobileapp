import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function HomeSelected(props) {
  return (
    <Svg width="23" height="23" viewBox="0 0 18 22" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.941 6.78l-5.973-5.069a3 3 0 00-3.972.079L.97 7.33A3 3 0 000 9.54V18a3 3 0 003 3h12a3 3 0 003-3V9.068a3 3 0 00-1.059-2.287zM8.35 3.263a1 1 0 011.324-.026l5.973 5.07a1 1 0 01.353.762v8.933a1 1 0 01-1 1h-2v-4.973a2 2 0 00-2-2H7a2 2 0 00-2 2v4.973H3a1 1 0 01-1-1V9.54a1 1 0 01.323-.736l6.027-5.54zM7 14.028h4v4.966H7v-4.966z"
        fill="#23C5B6"
      />
    </Svg>
  );
}

const MemoHomeSelected = React.memo(HomeSelected);
export default MemoHomeSelected;
