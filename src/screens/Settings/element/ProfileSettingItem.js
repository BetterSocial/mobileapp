import * as React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import IconChevronRight from '../../../assets/icons/images/chevron-right.svg';
import {fonts} from '../../../utils/fonts';
import {COLORS} from '../../../utils/theme';

/**
 * @typedef {Object} ProfileSettingItemProps
 * @property {String} text
 * @property {Function} onPress
 */
/**
 *
 * @param {ProfileSettingItemProps} props
 * @returns
 */
const ProfileSettingItem = ({text, onPress, ...props}) => (
  <TouchableOpacity onPress={onPress} {...props}>
    <View style={styles.card}>
      <Text style={styles.textCard}>{text}</Text>
      <IconChevronRight width={6.67} height={11.67} fill={COLORS.gray310} />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    height: 52,
    borderRadius: 8,
    backgroundColor: COLORS.gray110,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 18,
    paddingBottom: 18,
    marginBottom: 12
  },
  textCard: {
    fontFamily: fonts.inter[800],
    fontSize: 14,
    color: COLORS.white,
    lineHeight: 16
  }
});

export default ProfileSettingItem;
