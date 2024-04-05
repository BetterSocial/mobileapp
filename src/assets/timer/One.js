import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function One(props) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.666 2.747a.667.667 0 010-1.333h2.829a.667.667 0 010 1.333h-.748V4c0 .017 0 .034-.002.052.943.131 1.808.51 2.525 1.068l.258-.258a.667.667 0 11.943.943l-.258.258c.59.758.979 1.68 1.088 2.684H14a.667.667 0 110 1.334h-.719a5.335 5.335 0 11-5.866-6.05L7.414 4V2.747h-.748zM12 9.333a4 4 0 11-8 0 4 4 0 018 0z"
        fill={props.fill || '#828282'}
      />
      <Path d="M8 4.8a4.5 4.5 0 103.182 1.318L8 9.3V4.8z" fill={props.fill || '#828282'} />
    </Svg>
  );
}

const MemoOne = React.memo(One);
export default MemoOne;
