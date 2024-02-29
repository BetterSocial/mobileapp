import React from 'react';
import Svg, {ClipPath, Defs, G, Path, Rect} from 'react-native-svg';
import {COLORS} from '../../utils/theme';

export default function IconCheckCircleOutline({color, ...rest}) {
  return (
    <Svg width="18" height="18" viewBox="0 0 18 18" fill="none" {...rest}>
      <G clipPath="url(#clip0_18486_13116)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0 9C0 13.9706 4.02944 18 9 18C13.9706 18 18 13.9706 18 9C18 4.02944 13.9706 0 9 0C4.02944 0 0 4.02944 0 9ZM1.8 9C1.8 5.02355 5.02355 1.8 9 1.8C12.9764 1.8 16.2 5.02355 16.2 9C16.2 12.9764 12.9764 16.2 9 16.2C5.02355 16.2 1.8 12.9764 1.8 9ZM13.2634 6.90815C13.5993 6.54175 13.5746 5.97243 13.2082 5.63656C12.8417 5.30069 12.2724 5.32544 11.9366 5.69185L7.68228 10.3329L6.0914 8.42383C5.77319 8.04198 5.20568 7.99039 4.82383 8.3086C4.44198 8.62681 4.39039 9.19432 4.7086 9.57617L6.9586 12.2762C7.12484 12.4757 7.36915 12.5936 7.62876 12.5997C7.88836 12.6059 8.13797 12.4996 8.31344 12.3082L13.2634 6.90815Z"
          fill={`${color ?? COLORS.signed_primary}`}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_18486_13116">
          <Rect width="18" height="18" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
