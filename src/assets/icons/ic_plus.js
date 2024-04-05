import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function IcPlus(props) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 18 18" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.79623 1.4984C6.79623 1.08783 6.4634 0.755005 6.05283 0.755005C5.64227 0.755005 5.30944 1.08783 5.30944 1.4984L5.30944 5.95878L0.743397 5.95878C0.33283 5.95878 0 6.29161 0 6.70217C0 7.11274 0.33283 7.44557 0.743397 7.44557H5.30944L5.30943 12.0116C5.30943 12.4222 5.64226 12.755 6.05283 12.755C6.4634 12.755 6.79623 12.4222 6.79623 12.0116L6.79623 7.44557H11.2566C11.6672 7.44557 12 7.11274 12 6.70217C12 6.29161 11.6672 5.95878 11.2566 5.95878L6.79623 5.95878L6.79623 1.4984Z"
        fill={props.fill || 'black'}
      />
    </Svg>
  );
}

const MemoIcPlus = React.memo(IcPlus);
export default MemoIcPlus;
