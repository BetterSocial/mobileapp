import * as React from 'react';
import PropTypes from 'prop-types';
import Svg, {Path} from 'react-native-svg';

function Ic_user_group(props) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 18 14" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 7a2.5 2.5 0 00-2.5 2.5V12.833a.833.833 0 01-1.666 0V9.47a2.94 2.94 0 01-.689.017A.84.84 0 014 9.5h-.357a1.31 1.31 0 00-1.31 1.31V12a.833.833 0 01-1.666 0v-1.19c0-1.06.553-1.99 1.387-2.517a2.917 2.917 0 013.625-4.34 3.333 3.333 0 116.642 0 2.917 2.917 0 013.625 4.34 2.974 2.974 0 011.388 2.516V12a.833.833 0 01-1.667 0v-1.19a1.31 1.31 0 00-1.31-1.31H14a.84.84 0 01-.144-.012 2.951 2.951 0 01-.69-.017l.001.03V12.833a.833.833 0 01-1.667 0V9.5A2.5 2.5 0 009 7zm0-1.667A1.667 1.667 0 119 2a1.667 1.667 0 010 3.333zm-4.583 0a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5zm9.167 0a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5z"
        fill={props.fill || '#000'}
      />
    </Svg>
  );
}

Ic_user_group.propTypes = {
  fill: PropTypes.string
};
const MemoIc_user_group = React.memo(Ic_user_group);
export default MemoIc_user_group;
