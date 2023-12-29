import * as React from 'react';
import Svg, {Rect, Path} from 'react-native-svg';
import {colors} from '../../utils/colors';

function IcArrowBackCircle(props) {
  return (
    <Svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Rect width={32} height={32} rx={16} fill="#000" fillOpacity={0.6} />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M13.1239 21.2256C12.7756 21.5868 12.2058 21.5921 11.8512 21.2373L7.26936 16.654C7.09706 16.4816 7 16.246 7 16C7 15.754 7.09706 15.5184 7.26936 15.346L11.8512 10.7627C12.2058 10.4079 12.7756 10.4132 13.1239 10.7744C13.4722 11.1355 13.4671 11.7159 13.1125 12.0707L10.1008 15.0833L24.1 15.0833C24.5971 15.0833 25 15.4937 25 16C25 16.5063 24.5971 16.9167 24.1 16.9167L10.1008 16.9167L13.1125 19.9293C13.4671 20.2841 13.4722 20.8645 13.1239 21.2256Z"
        fill={colors.white}
      />
    </Svg>
  );
}

export default IcArrowBackCircle;
