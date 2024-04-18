import * as React from 'react';
import PropTypes from 'prop-types';
import Svg, {Path} from 'react-native-svg';

function Ic_camera(props) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 18 14" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M.667 2.833a2.5 2.5 0 012.5-2.5h11.667a2.5 2.5 0 012.5 2.5v8.334a2.5 2.5 0 01-2.5 2.5H3.167a2.5 2.5 0 01-2.5-2.5V2.833zM3.167 2a.833.833 0 00-.833.833v8.334c0 .46.373.833.833.833h11.667c.46 0 .833-.373.833-.833V2.833A.833.833 0 0014.834 2H3.167zm1.667 5a4.167 4.167 0 108.333 0 4.167 4.167 0 00-8.333 0zM9 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5zm4.167-5.833a.833.833 0 101.667 0 .833.833 0 00-1.667 0z"
        fill={props.fill || '#000'}
      />
    </Svg>
  );
}

Ic_camera.propTypes = {
  fill: PropTypes.string
};
const MemoIc_camera = React.memo(Ic_camera);
export default MemoIc_camera;
