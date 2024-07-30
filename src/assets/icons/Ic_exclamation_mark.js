import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {COLORS} from '../../utils/theme';

function Ic_exclamation_mark(props) {
  return (
    <Svg
      width={46}
      height={47}
      viewBox="0 0 46 47"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M24.899 14.053l-.222 12.435h-2.36l-.222-12.435H24.9zM23.501 31.67c-.471 0-.875-.165-1.21-.495a1.62 1.62 0 01-.494-1.21c-.006-.466.159-.863.494-1.193a1.65 1.65 0 011.21-.503c.46 0 .858.168 1.194.503.335.33.505.727.51 1.193a1.763 1.763 0 01-.86 1.474 1.61 1.61 0 01-.844.23z"
        fill={COLORS.white}
      />
    </Svg>
  );
}

const MemoIc_exclamation_mark = React.memo(Ic_exclamation_mark);
export default MemoIc_exclamation_mark;
