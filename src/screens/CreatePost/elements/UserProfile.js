import * as React from 'react';

import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import ToggleSwitch from '../../../components/ToggleSwitch';
import AnonymousAvatar from '../../../components/AnonymousAvatar';
import AnonymousProfile from '../../../assets/images/AnonymousProfile.png';
import AnonymousUsername from '../../../components/AnonymousUsername';
import {POST_VERSION} from '../../../utils/constants';
import {fonts} from '../../../utils/fonts';
import {COLORS} from '../../../utils/theme';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 11,
    paddingBottom: 12
  },
  profile: {flexDirection: 'row', alignItems: 'center'},
  username: {
    color: COLORS.black,
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: 14
  },
  desc: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: COLORS.gray400
  },
  switch: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: COLORS.gray400
  },
  image: {
    marginRight: 8,
    width: 32,
    height: 32,
    borderRadius: 16
  },
  containerMessage: {
    flex: 1,
    alignItems: 'flex-end'
  },
  anonymousAvatarContainerStyle: {
    marginRight: 8
  }
});

const UserProfile = ({
  setTypeUser,
  username,
  photo,
  onPress,
  isAnonymous = true,
  anonUserInfo = null,
  isToggleDisabled = false
}) => {
  const userProfile = () => {
    if (isAnonymous && anonUserInfo) {
      return (
        <View style={styles.profile}>
          <View style={styles.anonymousAvatarContainerStyle}>
            <AnonymousAvatar
              radius={31}
              emojiRadius={16}
              version={POST_VERSION}
              anonUserInfo={anonUserInfo}
              containerStyle={styles.anonymousAvatarContainerStyle}
            />
          </View>
          <View>
            <AnonymousUsername anonUserInfo={anonUserInfo} version={POST_VERSION} />
            <Text style={styles.desc}>Your alias for this post</Text>
          </View>
        </View>
      );
    }

    if (isAnonymous) {
      return (
        <View style={styles.profile}>
          <Image source={AnonymousProfile} width={32} height={32} style={styles.image} />
          <View>
            <Text style={styles.username}>Anonymous</Text>
            <Text style={styles.desc}>Username not visible</Text>
          </View>
        </View>
      );
    }

    return (
      <TouchableOpacity style={styles.profile} onPress={() => onPress()}>
        <Image source={photo} width={32} height={32} style={styles.image} />
        <View>
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.desc}>Your username is visible</Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <>
      <View style={styles.container}>
        {userProfile()}
        <ToggleSwitch
          value={isAnonymous}
          onValueChange={() => setTypeUser(!isAnonymous)}
          labelLeft="Incognito"
          backgroundActive={COLORS.gray100}
          backgroundInactive={COLORS.gray100}
          circleInActiveColor={COLORS.signed_primary}
          inactiveTextColor={COLORS.signed_primary}
          styleLabelLeft={styles.switch}
          isDisabled={isToggleDisabled}
        />
      </View>
    </>
  );
};

UserProfile.propTypes = {
  setTypeUser: PropTypes.func,
  username: PropTypes.string,
  photo: PropTypes.string,
  onPress: PropTypes.func,
  isAnonymous: PropTypes.bool,
  anonUserInfo: PropTypes.object,
  isToggleDisabled: PropTypes.bool
};

export default UserProfile;
