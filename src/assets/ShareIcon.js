import * as React from 'react';
import Svg, {ClipPath, Defs, G, Path, Rect} from 'react-native-svg';

function Share() {
  return (
    <Svg width="14" height="15" viewBox="0 0 14 15" fill="none">
      <G clipPath="url(#clip0_18368_9789)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3.00059 4.27314C2.72969 4.54896 2.73369 4.99216 3.0095 5.26305C3.28532 5.53394 3.72852 5.52995 3.99941 5.25413L6.3 2.91172V9.6C6.3 9.9866 6.6134 10.3 7 10.3C7.3866 10.3 7.7 9.9866 7.7 9.6V2.91172L10.0006 5.25413C10.2715 5.52995 10.7147 5.53394 10.9905 5.26305C11.2663 4.99216 11.2703 4.54896 10.9994 4.27314L7.49941 0.709505C7.36779 0.575492 7.18784 0.5 7 0.5C6.81216 0.5 6.63221 0.575492 6.50059 0.709505L3.00059 4.27314ZM1.4 7.5C1.4 7.1134 1.0866 6.8 0.7 6.8C0.313401 6.8 0 7.1134 0 7.5V13.8C0 14.1866 0.313401 14.5 0.7 14.5H13.3C13.6866 14.5 14 14.1866 14 13.8V7.5C14 7.1134 13.6866 6.8 13.3 6.8C12.9134 6.8 12.6 7.1134 12.6 7.5V13.1H1.4V7.5Z"
          fill="white"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_18368_9789">
          <Rect width="14" height="14" fill="white" transform="translate(0 0.5)" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

const ShareIcon = React.memo(Share);
export default ShareIcon;
