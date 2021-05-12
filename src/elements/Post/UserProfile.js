import React, {useState} from 'react';
import {Image, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import ProfileDefault from '../../assets/images/ProfileDefault.png';
import AnonymousProfile from '../../assets/images/AnonymousProfile.png';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import ToggleSwitch from 'toggle-switch-react-native';
import {useNavigation} from '@react-navigation/core';
const UserProfile = ({typeUser, setTypeUser, username, photo, onPress}) => {
  const [isanonymous, onanonymouschanged] = useState();
  const navigation = useNavigation();
  const userProfile = () => {
    if (typeUser) {
      return (
        <View style={styles.profile}>
          <Image
            source={AnonymousProfile}
            width={32}
            height={32}
            style={styles.image}
          />
          <View>
            <Text style={styles.username}>Anonymous</Text>
            <Text style={styles.desc}>Username not visible</Text>
          </View>
        </View>
      );
    } else {
      return (
        <TouchableOpacity style={styles.profile} onPress={() => onPress()}>
          <Image source={photo} width={32} height={32} style={styles.image} />
          <View>
            <Text style={styles.username}>{username}</Text>
            <Text style={styles.desc}>Your username is visible</Text>
          </View>
        </TouchableOpacity>
      );
    }
  };
  return (
    <View style={styles.container}>
      {userProfile()}
      <ToggleSwitch
        isOn={typeUser}
        onColor={colors.blue}
        label="Anonymity"
        offColor="#F5F5F5"
        size="small"
        labelStyle={styles.switch}
        onToggle={() => setTypeUser(!typeUser)}
      />
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 11,
    paddingBottom: 12,
  },
  profile: {flexDirection: 'row', alignItems: 'center'},
  username: {
    color: colors.black,
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: 14,
  },
  desc: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: colors.gray,
  },
  switch: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: colors.gray,
  },
  image: {
    marginRight: 8,
    width: 32,
    height: 32,
    borderRadius : 16
  },
});
