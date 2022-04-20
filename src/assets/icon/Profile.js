import * as React from 'react';
import {Image, StyleSheet} from 'react-native';

import {DEFAULT_PROFILE_PIC_PATH} from '../../utils/constants';
import {colors} from '../../utils/colors';

let ProfileIcon = ({uri, loadingUser}) => {
  if(!loadingUser) {
    if (uri) {
      return (
        <Image
          source={{
            uri: `${uri}`,
          }}
          width={19}
          height={19}
          style={styles.borderCircleImage}
        />
      );
    } else {
      return (
        <Image
          source={{
            uri: `${DEFAULT_PROFILE_PIC_PATH}`,
          }}
          width={19}
          height={19}
          style={styles.borderCircleImage}
        />
      );
    }
  }
  return null
 
};

let styles = StyleSheet.create({
  borderCircleImage: {
    borderRadius: 19,
    width: 19,
    height: 19,
    borderWidth: 0.25,
    borderColor: colors.gray1,
  },
});

export default ProfileIcon;
