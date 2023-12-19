import React from 'react';
import {View, StyleSheet, TouchableNativeFeedback, Text} from 'react-native';
import {fonts, normalize, normalizeFontSize} from '../../../utils/fonts';
import {COLORS} from '../../../utils/theme';

const ButtonFollow = ({handleSetFollow}) => {
  return (
    <TouchableNativeFeedback onPress={handleSetFollow}>
      <View style={styles.buttonFollow}>
        <Text style={styles.textButtonFollow}>Join</Text>
      </View>
    </TouchableNativeFeedback>
  );
};

const styles = StyleSheet.create({
  buttonFollow: {
    width: normalize(88),
    height: normalize(36),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: COLORS.blue
  },
  textButtonFollow: {
    fontFamily: fonts.inter[500],
    fontWeight: 'bold',
    fontSize: normalizeFontSize(12),
    color: COLORS.white,
    lineHeight: 24
  }
});

export default ButtonFollow;
