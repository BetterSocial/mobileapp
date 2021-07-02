import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SendComment(props) {
  return (
    <Svg width="19" height="15" viewBox="0 0 19 15" fill="none" {...props}>
      <Path
        filRule="evenodd"
        clipRule="evenodd"
        d="M0.980934 3.29972C1.06028 2.96135 1.33318 2.7094 1.67333 2.66049L17.986 0.314882C18.3343 0.264794 18.6826 0.437652 18.8631 0.750166C19.0435 1.06268 19.019 1.45074 18.8015 1.72737L8.61381 14.6817C8.40138 14.9519 8.04672 15.0622 7.71402 14.9618C7.38131 14.8613 7.13548 14.5696 7.09031 14.2217L6.28425 8.01254L1.31001 4.20991C1.0313 3.99684 0.901591 3.63809 0.980934 3.29972ZM8.00802 8.02768L8.52107 11.9798L14.6406 4.19838L8.00802 8.02768ZM13.7656 2.68284L7.13302 6.51215L3.96695 4.09179L13.7656 2.68284Z"
        fill="white"
      />
    </Svg>
  );
}

const MemoSendComment = React.memo(SendComment);
export default MemoSendComment;
