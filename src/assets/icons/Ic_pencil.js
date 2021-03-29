import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function Ic_pencil(props) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 18 18" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.008 1.158a1.675 1.675 0 012.37 0l2.465 2.465a1.675 1.675 0 010 2.37L6.618 16.216c-.233.233-.53.392-.852.457l-3.092.626A1.675 1.675 0 01.7 15.326l.626-3.092c.066-.323.225-.619.457-.852L12.008 1.158zM2.703 13.876l.107-.532 1.846 1.846-.532.107-1.782.361.36-1.782zm3.447.44L3.685 11.85l7.191-7.191 2.466 2.465-7.192 7.191zm8.376-8.377l1.132-1.131-1.184-1.185-.097-.096-1.184-1.185-1.132 1.132 2.465 2.465z"
        fill="#fff"
      />
    </Svg>
  );
}

const MemoIc_pencil = React.memo(Ic_pencil);
export default MemoIc_pencil;
