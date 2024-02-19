import React from 'react';
import {View, StyleSheet, TouchableNativeFeedback, Text} from 'react-native';
import {fonts} from '../../utils/fonts';
import {COLORS} from '../../utils/theme';

const ButtonFollow = ({handleSetFollow}) => (
  <TouchableNativeFeedback onPress={handleSetFollow}>
    <View style={styles.buttonFollow}>
      <Text style={styles.textButtonFollow}>Follow</Text>
    </View>
  </TouchableNativeFeedback>
);

const styles = StyleSheet.create({
  buttonFollow: {
    width: 58,
    height: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: COLORS.anon_primary
  },
  textButtonFollow: {
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: 12,
    color: COLORS.white
  }
});

export default ButtonFollow;
