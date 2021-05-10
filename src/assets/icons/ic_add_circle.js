import * as React from 'react';
import Svg, {Rect, G, Path, Defs, ClipPath} from 'react-native-svg';

function IcAddCircle(props) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 20 20" fill="none" {...props}>
      <Rect width={48} height={48} rx={24} fill="none"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20ZM10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2ZM10.0005 4.75736C10.5527 4.75736 11.0005 5.20507 11.0005 5.75736V9H14.2426C14.7949 9 15.2426 9.44772 15.2426 10C15.2426 10.5523 14.7949 11 14.2426 11H11.0005V14.2426C11.0005 14.7949 10.5527 15.2426 10.0005 15.2426C9.44817 15.2426 9.00045 14.7949 9.00045 14.2426V11H5.75736C5.20507 11 4.75736 10.5523 4.75736 10C4.75736 9.44771 5.20507 9 5.75736 9H9.00045V5.75736C9.00045 5.20507 9.44817 4.75736 10.0005 4.75736Z" fill="white"/>
    </Svg>
  );
}

const MemoIcAddCircle = React.memo(IcAddCircle);
export default MemoIcAddCircle;
