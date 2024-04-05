import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {COLORS} from '../../utils/theme';

function ic_globe(props) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 14 14" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 13.667A6.667 6.667 0 117 .333a6.667 6.667 0 010 13.334zm0-12c-.125 0-.25.004-.372.012l-.074.096a6.724 6.724 0 00-.624 1.023 8.412 8.412 0 00-.584 1.535h3.308a8.412 8.412 0 00-.584-1.535 6.724 6.724 0 00-.698-1.119A5.414 5.414 0 007 1.667zM3.667 7c0-.47.026-.914.072-1.333H1.835a5.343 5.343 0 000 2.666h1.904A12.065 12.065 0 013.667 7zm.303 2.667H2.38A5.356 5.356 0 004.76 11.84l-.022-.043a9.859 9.859 0 01-.767-2.131zm1.376 0h3.308a8.413 8.413 0 01-.584 1.535 6.726 6.726 0 01-.698 1.118 5.401 5.401 0 01-.744 0 6.726 6.726 0 01-.698-1.119 8.413 8.413 0 01-.584-1.534zm3.572-1.334H5.082A10.658 10.658 0 015 7c0-.475.03-.92.082-1.333h3.836C8.97 6.08 9 6.525 9 7s-.03.92-.082 1.333zm1.112 1.334a9.858 9.858 0 01-.767 2.131l-.022.043a5.356 5.356 0 002.379-2.174h-1.59zm2.135-1.334h-1.904a12.058 12.058 0 000-2.666h1.904a5.342 5.342 0 010 2.666zM4.737 2.202a9.859 9.859 0 00-.767 2.131H2.38A5.356 5.356 0 014.76 2.16l-.022.043zm4.504-.043a5.356 5.356 0 012.379 2.174h-1.59a9.858 9.858 0 00-.767-2.131l-.022-.043z"
        fill={props.color || COLORS.gray410}
      />
    </Svg>
  );
}

const Memoic_globe = React.memo(ic_globe);
export default Memoic_globe;
