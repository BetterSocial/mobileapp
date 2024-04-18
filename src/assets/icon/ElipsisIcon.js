import * as React from 'react';
import Svg, {ClipPath, Defs, G, Path, Rect} from 'react-native-svg';

function ElipsisIcon({color, ...rest}) {
  return (
    <Svg width="17" height="17" viewBox="0 0 17 17" fill="none" {...rest}>
      <G clipPath="url(#clip0_20043_5280)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6.57617 14.6627C6.57617 15.6445 7.37211 16.4404 8.35395 16.4404C9.33579 16.4404 10.1317 15.6445 10.1317 14.6627C10.1317 13.6808 9.33579 12.8849 8.35395 12.8849C7.37211 12.8849 6.57617 13.6808 6.57617 14.6627ZM6.57617 8.44043C6.57617 9.42227 7.37211 10.2182 8.35395 10.2182C9.33579 10.2182 10.1317 9.42227 10.1317 8.44043C10.1317 7.45859 9.33579 6.66265 8.35395 6.66265C7.37211 6.66265 6.57617 7.45859 6.57617 8.44043ZM8.35395 3.99598C7.37211 3.99598 6.57617 3.20005 6.57617 2.21821C6.57617 1.23637 7.37211 0.44043 8.35395 0.44043C9.33579 0.44043 10.1317 1.23637 10.1317 2.21821C10.1317 3.20005 9.33579 3.99598 8.35395 3.99598Z"
          fill={color}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_20043_5280">
          <Rect width="16" height="16" fill="white" transform="translate(0.353516 0.44043)" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default ElipsisIcon;
