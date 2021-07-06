import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function Ic_upvote_off(props) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 20 17" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.458.303L.082 16.097a.587.587 0 00.073.697.645.645 0 00.705.162L7.3 14.425a7.408 7.408 0 015.4 0l6.44 2.528a.645.645 0 00.704-.162.593.593 0 00.075-.694L10.54.303a.615.615 0 00-.229-.222.642.642 0 00-.854.222zM10 .6L9.458.303l.54.298M10 3.404L3.955 13.587l2.566-1.008a9.55 9.55 0 016.96 0l2.564 1.007L10 3.404z"
        fill="#C4C4C4"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.53 12.072L10.545.303a.615.615 0 00-.23-.22.642.642 0 00-.854.22L.083 16.098a.587.587 0 00.075.694.645.645 0 00.703.162l6.392-2.506.05-.02c.492-.216 4.713-2.029 7.779-2.465.992-.14 1.863-.138 2.448.11zm-3.54-1.948l-3.987-6.72-6.047 10.184 2.5-.98.01-.004a49.83 49.83 0 014.66-1.738 27.008 27.008 0 012.865-.742z"
        fill="#C4C4C4"
      />
    </Svg>
  );
}

const MemoIc_upvote_off = React.memo(Ic_upvote_off);
export default MemoIc_upvote_off;
