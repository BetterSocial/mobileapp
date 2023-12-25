import React from 'react';
import {View, TouchableNativeFeedback, Text, StyleSheet} from 'react-native';
import {fonts, normalize, normalizeFontSize} from '../../../utils/fonts';
import {COLORS} from '../../../utils/theme';

const ButtonFollowing = ({handleSetUnFollow}) => {
  return (
    <TouchableNativeFeedback onPress={handleSetUnFollow}>
      <View style={styles.buttonFollowing}>
        <Text style={styles.textButtonFollowing}>Joined</Text>
      </View>
    </TouchableNativeFeedback>
  );
};

const styles = StyleSheet.create({
  buttonFollowing: {
    width: normalize(88),
    height: normalize(36),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.anon_primary,
    borderRadius: 8
  },
  textButtonFollowing: {
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: normalizeFontSize(12),
    color: COLORS.anon_primary
  }
});

export default ButtonFollowing;
