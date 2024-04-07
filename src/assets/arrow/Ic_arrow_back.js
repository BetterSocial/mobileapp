import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function IcArrowBack(props) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 20 12" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.804 11.7a1 1 0 01-1.414.013l-5.09-5a1 1 0 010-1.426l5.09-5a1 1 0 011.402 1.426L3.445 5H19a1 1 0 110 2H3.445l3.347 3.287a1 1 0 01.012 1.414z"
        fill={props.fill || '#000'}
      />
    </Svg>
  );
}

export default IcArrowBack;
