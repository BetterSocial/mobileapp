import React from 'react';
import Svg, {ClipPath, Defs, G, Path, Rect} from 'react-native-svg';
import {COLORS} from '../../utils/theme';

export default function IconCommentArrow({color, ...rest}) {
  return (
    <Svg width="17" height="17" viewBox="0 0 17 17" fill="none" {...rest}>
      <G clipPath="url(#clip0_20043_5298)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.81626 0.638379C4.48375 0.347434 3.97834 0.381128 3.68739 0.713637L0.887391 3.91364C0.623474 4.21526 0.623474 4.66562 0.887391 4.96724L3.68739 8.16724C3.97834 8.49975 4.48375 8.53345 4.81626 8.2425C5.14877 7.95156 5.18246 7.44615 4.89152 7.11364L3.25247 5.24044L5.88945 5.24044C10.9705 5.24044 15.0895 9.3594 15.0895 14.4404L15.0895 15.6404C15.0895 16.0823 15.4476 16.4404 15.8895 16.4404C16.3313 16.4404 16.6895 16.0823 16.6895 15.6404V14.4404C16.6895 8.47574 11.8541 3.64044 5.88945 3.64044L3.25247 3.64044L4.89152 1.76724C5.18246 1.43474 5.14877 0.929325 4.81626 0.638379Z"
          fill={color ?? COLORS.white}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_20043_5298">
          <Rect
            width="16"
            height="16"
            fill={color ?? COLORS.white}
            transform="translate(0.688477 0.44043)"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
