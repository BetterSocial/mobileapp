import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function Ic_pencil(props) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 20 20" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.008 2.157a1.675 1.675 0 012.37 0l2.465 2.466a1.675 1.675 0 010 2.369L7.618 17.216c-.233.233-.53.392-.852.458l-3.092.626A1.675 1.675 0 011.7 16.326l.626-3.092c.066-.323.225-.62.458-.852L13.008 2.157zM3.703 14.876l.108-.532 1.845 1.845-.532.108-1.782.361.36-1.782zm3.448.439L4.684 12.85l7.191-7.192 2.466 2.466-7.192 7.191zm8.375-8.376l1.132-1.132-1.184-1.184-.097-.097-1.184-1.184-1.132 1.132 2.465 2.465z"
        fill="#00ADB5"
      />
    </Svg>
  );
}

const MemoIc_pencil = React.memo(Ic_pencil);
export default MemoIc_pencil;
