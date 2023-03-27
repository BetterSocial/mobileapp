import * as React from 'react';
import ToggleSwitch from 'toggle-switch-react-native';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import AnonymousAvatar from '../../../components/AnonymousAvatar';
import AnonymousProfile from '../../../assets/images/AnonymousProfile.png';
import AnonymousUsername from '../../../components/AnonymousUsername';
import {POST_VERSION} from '../../../utils/constants';
import {colors} from '../../../utils/colors';
import {fonts} from '../../../utils/fonts';

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
    color: colors.black,
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: 14
  },
  desc: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: colors.gray
  },
  switch: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: colors.gray
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
  anonUserInfo = null
}) => {
  const userProfile = () => {
    if (isAnonymous && anonUserInfo) {
      return (
        <View style={styles.profile}>
          <AnonymousAvatar
            radius={32}
            emojiRadius={16}
            version={POST_VERSION}
            anonUserInfo={anonUserInfo}
            containerStyle={styles.anonymousAvatarContainerStyle}
          />
          <View>
            <AnonymousUsername anonUserInfo={anonUserInfo} version={POST_VERSION} />
            <Text style={styles.desc}>This is your anonymous username</Text>
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
          isOn={isAnonymous}
          onColor={colors.blue}
          label="Anonymity"
          offColor="#F5F5F5"
          size="small"
          labelStyle={styles.switch}
          onToggle={() => setTypeUser(!isAnonymous)}
        />
      </View>
    </>
  );
};

export default UserProfile;
