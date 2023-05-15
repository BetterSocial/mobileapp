import * as React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import Mi from 'react-native-vector-icons/MaterialIcons';

import MemoIc_Checklist from '../../assets/icons/Ic_Checklist';
import {COLORS} from '../../utils/theme';
import {fonts, normalize, normalizeFontSize} from '../../utils/fonts';

const ProfileContact = ({photo, fullname, onPress, select, showArrow, userId, item}) => (
  <Pressable
    onPress={onPress}
    android_ripple={{
      color: COLORS.gray1,
      borderless: false,
      borderRadius: 10
    }}
    style={styles.pressable}>
    <View style={styles.container}>
      <View style={styles.profile}>
        <Image
          testID="image"
          style={styles.image}
          source={{uri: photo !== '' ? photo : undefined}}
        />
        <Text style={styles.fullname}>{fullname}</Text>
      </View>
      {showArrow && (
        <>
          {userId !== item.user_id && (
            <View>
              <Mi name="arrow-forward-ios" size={18} />
            </View>
          )}
        </>
      )}
      {select && (
        <View testID="selected">
          <MemoIc_Checklist />
        </View>
      )}
    </View>
  </Pressable>
);

export default ProfileContact;

const styles = StyleSheet.create({
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  image: {
    height: normalize(48),
    width: normalize(48),
    borderRadius: normalize(24),
    marginRight: 17
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15
  },
  fullname: {
    fontSize: normalizeFontSize(14),
    fontFamily: fonts.inter[500],
    color: '#000',
    lineHeight: normalizeFontSize(16.94)
  },
  pressable: {
    height: '100%'
  },
  arroIcon: {
    height: 14,
    width: 14
  }
});