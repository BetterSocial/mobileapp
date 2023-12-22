import * as React from 'react';
import PropTypes from 'prop-types';
import Svg, {G, Defs, ClipPath, Path, Rect} from 'react-native-svg';

function PlusAttachment(props) {
  const {fillIcon = '#107793'} = props;
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" {...props}>
      <G clipPath="url(#clip0_0_21627)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M17.593 5.487a1.487 1.487 0 00-2.974 0v8.92H5.487a1.487 1.487 0 000 2.974h9.132v9.132a1.487 1.487 0 102.974 0v-9.132h8.92a1.487 1.487 0 100-2.973h-8.92V5.487z"
          fill={fillIcon}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_0_21627">
          <Path fill="#fff" transform="translate(4 4)" d="M0 0H24V24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

PlusAttachment.propTypes = {
  fillIcon: PropTypes.string
};

const MemoPlusAttachment = React.memo(PlusAttachment);
export default MemoPlusAttachment;
