import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {COLORS} from '../../utils/theme';

const IconChatDelivered = (props) => (
  <Svg
    width={21}
    height={12}
    fill="none"
    viewBox="0 0 21 12"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19.936 2.502a.903.903 0 1 0-1.293-1.262l-8.126 8.322-1.019-1.203-1.27 1.296 1.552 1.832a.903.903 0 0 0 1.335.047l8.82-9.032Zm-5.42 0a.903.903 0 0 0-1.291-1.262L5.098 9.562 1.915 5.803A.903.903 0 0 0 .536 6.971l3.825 4.516a.903.903 0 0 0 1.335.047l8.82-9.032Z"
      fill={COLORS.blackgrey}
    />
  </Svg>
);

export default IconChatDelivered;
