import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

function IconFile(props) {
  return (
    <Svg
      width={18}
      height={20}
      viewBox="0 0 18 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <G clipPath="url(#clip0_8_21756)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3 20h12a3 3 0 003-3V6.38a3 3 0 00-.755-1.99l-1.648-1.86-1.283-1.488A3 3 0 0012.042 0H3a3 3 0 00-3 3v14a3 3 0 003 3zM13 2.58l1.09 1.266L15.115 5H13V2.58zM11 2v4a1 1 0 001 1h4v10a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1h8z"
          fill={props.fill || '#69707C'}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_8_21756">
          <Path fill="#fff" d="M0 0H18V20H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default IconFile;
