import React from 'react';
import Svg, {ClipPath, Defs, G, Path, Rect} from 'react-native-svg';
import {COLORS} from '../../utils/theme';

export default function IconClose({color, ...rest}) {
  return (
    <Svg width="12" height="12" viewBox="0 0 12 12" fill="none" {...rest}>
      <G clipPath="url(#clip0_18482_23871)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.8047 1.13807C12.0651 0.877722 12.0651 0.455612 11.8047 0.195262C11.5444 -0.0650874 11.1223 -0.0650874 10.8619 0.195262L6 5.05719L1.13807 0.195262C0.877722 -0.0650874 0.455612 -0.0650874 0.195263 0.195262C-0.0650863 0.455612 -0.0650863 0.877722 0.195263 1.13807L5.05719 6L0.195262 10.8619C-0.0650874 11.1223 -0.0650874 11.5444 0.195262 11.8047C0.455612 12.0651 0.877722 12.0651 1.13807 11.8047L6 6.94281L10.8619 11.8047C11.1223 12.0651 11.5444 12.0651 11.8047 11.8047C12.0651 11.5444 12.0651 11.1223 11.8047 10.8619L6.94281 6L11.8047 1.13807Z"
          fill={`${color ?? COLORS.balance_gray}`}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_18482_23871">
          <Rect width="12" height="12" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
