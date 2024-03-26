import React from 'react';
import PropTypes from 'prop-types';
import {View, TouchableNativeFeedback, Text, StyleSheet} from 'react-native';
import {fonts, normalize, normalizeFontSize} from '../../../utils/fonts';
import {COLORS} from '../../../utils/theme';

const ButtonFollowing = ({handleSetUnFollow, followType = 'signed'}) => {
  return (
    <TouchableNativeFeedback onPress={handleSetUnFollow}>
      <View style={styles.buttonFollowing(followType)}>
        <Text style={styles.textButtonFollowing(followType)}>Joined</Text>
      </View>
    </TouchableNativeFeedback>
  );
};

ButtonFollowing.propTypes = {
  handleSetUnFollow: PropTypes.func,
  followType: PropTypes.string
};

const styles = StyleSheet.create({
  buttonFollowing: (followType) => ({
    width: normalize(88),
    height: normalize(36),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: followType === 'incognito' ? COLORS.anon_secondary : COLORS.signed_primary,
    borderRadius: 8
  }),
  textButtonFollowing: (followType) => ({
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: normalizeFontSize(12),
    color: followType === 'incognito' ? COLORS.anon_secondary : COLORS.signed_primary
  })
});

export default ButtonFollowing;
