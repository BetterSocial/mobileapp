import * as React from 'react';
import Svg, {ClipPath, Defs, G, Path, Rect} from 'react-native-svg';

function Pencil(props) {
  const size = props.size || 14;
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <G clipPath="url(#clip0_18360_9768)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.52691 0.412139C10.0764 -0.13738 10.9674 -0.13738 11.5169 0.412139L13.5879 2.4831C14.1374 3.03262 14.1374 3.92357 13.5879 4.47309L4.9992 13.0617C4.8036 13.2573 4.55469 13.391 4.28358 13.4459L1.68653 13.972C1.22421 14.0656 0.745713 13.9214 0.412163 13.5878C0.078612 13.2543 -0.0656178 12.7758 0.0280348 12.3135L0.554127 9.71642C0.609047 9.44531 0.742656 9.1964 0.938255 9.0008L9.52691 0.412139ZM1.71044 11.0957L1.80092 10.649L3.35097 12.1991L2.9043 12.2896L1.40715 12.5928L1.71044 11.0957ZM4.60642 11.4645L2.53545 9.39359L8.57612 3.35292L10.6471 5.42388L4.60642 11.4645ZM11.6421 4.42889L12.5929 3.4781L11.5979 2.4831L11.5169 2.40212L10.5219 1.40713L9.57111 2.35793L11.6421 4.42889Z"
          fill="white"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_18360_9768">
          <Rect width={size} height={size} fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

const PencilIcon = React.memo(Pencil);
export default PencilIcon;
