import * as React from 'react';
import Svg, {Path, Defs, ClipPath, Rect} from 'react-native-svg';
import {COLORS} from '../../utils/theme';

function SendDM(props) {
  return (
    <Svg width="17" height="16" viewBox="0 0 17 16" fill="none" {...props}>
      <Defs>
        <ClipPath id="clip0">
          <Rect width="16" height="16" fill="white" transform="translate(0.943848)" />
        </ClipPath>
      </Defs>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.7298 0.281931C16.9532 0.547396 17.0086 0.937168 16.8698 1.26619L10.8692 15.4884C10.7466 15.7789 10.4926 15.9735 10.2046 15.9975C9.91655 16.0215 9.63925 15.8712 9.47904 15.6042L7.98966 13.1221L5.74123 14.5495C5.4936 14.7068 5.18937 14.7056 4.9427 14.5466C4.69602 14.3875 4.5442 14.0946 4.5442 13.7778V9.46656L1.41898 7.9234C1.12377 7.77763 0.936428 7.44891 0.944073 7.09009C0.951718 6.73127 1.15285 6.41277 1.45394 6.28268L15.8553 0.0604729C16.1602 -0.0712327 16.5065 0.0164654 16.7298 0.281931ZM6.14436 10.3271L6.39659 10.4673L7.09994 11.6394L6.14436 12.2461V10.3271ZM8.00059 9.9354L10.0229 13.3056L13.8148 4.31841L8.00059 9.9354ZM12.1536 3.56729L3.82471 7.16585L5.66922 8.07662C5.68029 8.08209 5.69125 8.08784 5.70208 8.09386L6.82341 8.71675L12.1536 3.56729Z"
        fill={COLORS.gray9}
        clipPath="url(#clip0)"
      />
    </Svg>
  );
}

const MemoSendDM = React.memo(SendDM);
export default MemoSendDM;
