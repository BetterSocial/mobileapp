import React from 'react';
import {Image, StyleSheet} from 'react-native';

import {DEFAULT_PROFILE_PIC_PATH} from '../../utils/constants';
import {Context} from '../../context';
import {LoadingStartupContext} from '../../service/initialStartup';
import {COLORS} from '../../utils/theme';
import dimen from '../../utils/dimen';

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
          width={dimen.normalizeDimen(20)}
          height={dimen.normalizeDimen(20)}
          style={styles.borderCircleImage}
        />
      );
    }
    return (
      <Image
        source={{
          uri: `${DEFAULT_PROFILE_PIC_PATH}`
        }}
        width={dimen.normalizeDimen(20)}
        height={dimen.normalizeDimen(20)}
        style={styles.borderCircleImage}
      />
    );
  }
  return null;
};

const styles = StyleSheet.create({
  borderCircleImage: {
    borderRadius: 20,
    width: dimen.normalizeDimen(20),
    height: dimen.normalizeDimen(20),
    borderWidth: 0.25,
    borderColor: COLORS.gray110
  }
});

export default ProfileIcon;
