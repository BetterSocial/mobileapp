import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function IconSecurityLock(props) {
  return (
    <Svg
      width={33}
      height={32}
      viewBox="0 0 33 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.744 11.607V9.6c0-3.535 3.07-6.4 6.858-6.4 3.787 0 6.857 2.865 6.857 6.4v2.008C21.515 10.341 19.15 9.6 16.602 9.6c-2.55 0-4.914.742-6.858 2.008zm0 4.393c1.564-1.944 4.054-3.2 6.858-3.2 2.803 0 5.293 1.256 6.857 3.2 1.076 1.337 1.714 2.999 1.714 4.8 0 4.418-3.838 8-8.571 8-4.734 0-8.572-3.582-8.572-8 0-1.801.638-3.463 1.714-4.8zm-3.428-.972V9.6c0-5.302 4.605-9.6 10.286-9.6 5.68 0 10.285 4.298 10.285 9.6v5.428a10.596 10.596 0 011.715 5.772c0 6.186-5.373 11.2-12 11.2-6.628 0-12-5.014-12-11.2 0-2.111.626-4.087 1.714-5.772zM16.602 17.6c1.893 0 3.428 1.433 3.428 3.2 0 1.767-1.535 3.2-3.428 3.2-1.894 0-3.429-1.433-3.429-3.2 0-1.767 1.535-3.2 3.429-3.2z"
        fill="#fff"
      />
    </Svg>
  );
}

export default IconSecurityLock;
