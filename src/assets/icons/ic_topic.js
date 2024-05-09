import * as React from 'react';
import PropTypes from 'prop-types';
import Svg, {Path} from 'react-native-svg';

function IcTopic(props) {
  return (
    <Svg
      width={14}
      height={17}
      viewBox="0 0 14 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M7.382 16.523l2.625-16h1.875l-2.625 16H7.382zM.14 12.243l.305-1.876H12.57l-.305 1.875H.14zm1.617 4.28l2.625-16h1.875l-2.625 16H1.757zM1.07 6.68l.305-1.875H13.5l-.305 1.875H1.07z"
        fill={props.fill || '#0391FB'}
      />
    </Svg>
  );
}

IcTopic.propTypes = {
  fill: PropTypes.string
};
const MemoIcTopic = React.memo(IcTopic);
export default MemoIcTopic;
