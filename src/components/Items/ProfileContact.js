import * as React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableNativeFeedback,
  Pressable,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import MemoIc_Checklist from '../../assets/icons/Ic_Checklist';

import {fonts, normalize, normalizeFontSize} from '../../utils/fonts';
import {COLORS} from '../../utils/theme';

const ProfileContact = ({photo, fullname, onPress, select}) => {
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{
        color: COLORS.gray1,
        borderless: false,
        borderRadius: 10,
      }}
      style={styles.pressable}>
      <View style={styles.container}>
        <View style={styles.profile}>
          <Image style={styles.image} source={{uri: photo}} />
          <Text style={styles.fullname}>{fullname}</Text>
        </View>
        {select && <MemoIc_Checklist />}
      </View>
    </Pressable>
  );
};

export default ProfileContact;

const styles = StyleSheet.create({
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  image: {
    height: normalize(48),
    width: normalize(48),
    borderRadius: normalize(24),
    marginRight: 17,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  fullname: {
    fontSize: normalizeFontSize(14),
    fontFamily: fonts.inter[500],
    color: '#000',
    lineHeight: normalizeFontSize(16.94),
  },
  pressable: {
    height: '100%',
  },
});
