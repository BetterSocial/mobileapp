import * as React from 'react';
import {Image} from 'react-native';

import {DEFAULT_PROFILE_PIC_PATH} from '../../utils/constants';
import {colors} from '../../utils/colors';

let ProfileIcon = ({uri}) => {
  if (uri) {
    return (
      <Image
        source={{
          uri: `${uri}`,
        }}
        width={19}
        height={19}
        style={{
          borderRadius: 19,
          width: 19,
          height: 19,
          borderWidth: 0.25,
          borderColor: colors.gray1,
        }}
      />
    );
  }

  return <></>;
};

export default ProfileIcon;
