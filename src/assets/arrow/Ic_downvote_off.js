import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function Ic_downvote_off(props) {
  return (
    <Svg width="20" height="17" viewBox="0 0 20 17" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.542 16.698L19.918.903a.587.587 0 00-.073-.697.646.646 0 00-.705-.162L12.7 2.575a7.409 7.409 0 01-5.4 0L.86.047a.646.646 0 00-.704.162.594.594 0 00-.075.694L9.46 16.698a.614.614 0 00.229.221.642.642 0 00.854-.221zM10 16.399l.542.299-.54-.3M10 13.597l6.045-10.183-2.566 1.008a9.55 9.55 0 01-6.96 0L3.955 3.414 10 13.596z"
        fill="#C4C4C4"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.47 4.928l6.985 11.77a.614.614 0 00.23.221.642.642 0 00.854-.221L19.916.903a.587.587 0 00-.075-.694.646.646 0 00-.703-.162l-6.393 2.506-.048.02c-.493.216-4.714 2.029-7.78 2.465-.992.141-1.863.138-2.448-.11zm3.54 1.948l3.987 6.72 6.047-10.184-2.5.98-.01.004a49.85 49.85 0 01-4.66 1.738c-.912.285-1.902.556-2.865.742z"
        fill="#C4C4C4"
      />
    </Svg>
  );
}

const MemoIc_downvote_off = React.memo(Ic_downvote_off);
export default MemoIc_downvote_off;
