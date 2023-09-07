import React from 'react';
import {View, StyleSheet, TouchableNativeFeedback, Text} from 'react-native';
import {colors} from '../../../utils/colors';
import {fonts} from '../../../utils/fonts';

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
    width: 88,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.bondi_blue
  },
  textButtonFollow: {
    fontFamily: fonts.inter[500],
    fontWeight: 'bold',
    fontSize: 12,
    color: colors.white,
    lineHeight: 24
  }
});

export default ButtonFollow;
