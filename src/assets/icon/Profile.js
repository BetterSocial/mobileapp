import React from 'react';
import {Image, StyleSheet} from 'react-native';

import {DEFAULT_PROFILE_PIC_PATH} from '../../utils/constants';
import {Context} from '../../context';
import {LoadingStartupContext} from '../../service/initialStartup';
import {COLORS} from '../../utils/theme';

const ProfileIcon = () => {
  const [myProfile] = React.useContext(Context).profile;
  const loadingStartup = React.useContext(LoadingStartupContext);
  if (!loadingStartup.loadingUser) {
    if (myProfile.myProfile.profile_pic_path) {
      return (
        <Image
          source={{
            uri: `${myProfile.myProfile.profile_pic_path}`
          }}
          width={19}
          height={19}
          style={styles.borderCircleImage}
        />
      );
    }
    return (
      <Image
        source={{
          uri: `${DEFAULT_PROFILE_PIC_PATH}`
        }}
        width={19}
        height={19}
        style={styles.borderCircleImage}
      />
    );
  }
  return null;
};

const styles = StyleSheet.create({
  borderCircleImage: {
    borderRadius: 19,
    width: 19,
    height: 19,
    borderWidth: 0.25,
    borderColor: COLORS.gray9
  }
});

export default ProfileIcon;
