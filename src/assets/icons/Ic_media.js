import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {COLORS} from '../../utils/theme';

function Ic_media(props) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 18 18" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M.667 2.333c0-.92.746-1.666 1.667-1.666h13.333c.92 0 1.667.746 1.667 1.666V15.666c0 .921-.747 1.667-1.667 1.667H2.334c-.92 0-1.667-.746-1.667-1.666v-2.5V2.334zM2.334 13.52V15.666h13.333v-3.543l-2.488-2.757-4.536 4.399a.833.833 0 01-1.07.075L4.39 11.526 2.334 13.52zm13.333-3.884l-1.83-2.027a.834.834 0 00-1.198-.04L7.986 12.08 4.803 9.765a.833.833 0 00-1.07.076l-1.4 1.357V2.333h13.334v7.302zM6.5 6.083a1.25 1.25 0 112.5 0 1.25 1.25 0 01-2.5 0z"
        fill={props.fill || '#000'}
      />
    </Svg>
  );
}

const MemoIc_media = React.memo(Ic_media);
export default MemoIc_media;
