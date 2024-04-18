import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function Ic_interface(props) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 20 20" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.553 1.722a.845.845 0 00-.825.864c.005.473.38.853.84.849l3.905-.037-5.624 5.785a.874.874 0 000 1.211.816.816 0 001.177 0L16.65 4.61l-.035 4.016a.845.845 0 00.825.864.844.844 0 00.84-.848l.053-6.11a.869.869 0 00-.243-.613.82.82 0 00-.597-.251l-5.94.055zM2.5 2.065a.845.845 0 00-.832.856v14.556c0 .473.372.857.832.857h14.985c.46 0 .832-.384.832-.857v-4.28a.845.845 0 00-.832-.857.845.845 0 00-.833.856v3.425H3.331V3.777h3.747c.46 0 .832-.383.832-.856a.845.845 0 00-.832-.856H2.499z"
        fill={props.fill || '#00ADB5'}
      />
    </Svg>
  );
}

const MemoIc_interface = React.memo(Ic_interface);
export default MemoIc_interface;
