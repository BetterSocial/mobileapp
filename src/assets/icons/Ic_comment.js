import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {COLORS} from '../../utils/theme';

function Ic_comment(props) {
  return (
    <Svg width="25" height="25" viewBox="0 0 25 25" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.083 15.693V6.267c0-1.735 1.4-3.142 3.125-3.142h14.584a3.133 3.133 0 013.125 3.142v9.426c0 1.735-1.4 3.142-3.125 3.142h-4.426l-2.714 2.387c-1.683 1.481-4.319.28-4.319-1.97v-.417H5.208a3.133 3.133 0 01-3.125-3.142zm8.085 2.148a2.081 2.081 0 00-1.835-1.1H5.208a1.044 1.044 0 01-1.041-1.048V6.267c0-.578.466-1.047 1.041-1.047h14.584c.575 0 1.041.469 1.041 1.047v9.426c0 .578-.466 1.047-1.041 1.047h-4.426c-.505 0-.992.184-1.372.518l-2.714 2.388a.52.52 0 01-.863-.394v-.417a2.126 2.126 0 00-.232-.962l-.017-.032zM7.292 9.375c0-.575.466-1.042 1.041-1.042h8.334a1.042 1.042 0 110 2.084H8.333a1.042 1.042 0 01-1.041-1.042zm1.041 2.083a1.042 1.042 0 100 2.084h5.209a1.042 1.042 0 000-2.084H8.333z"
        fill={props.color || COLORS.gray400}
      />
    </Svg>
  );
}

const MemoIc_comment = React.memo(Ic_comment);
export default MemoIc_comment;
