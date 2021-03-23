import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';

const ButtonAddMedia = () => {
  return (
    <TouchableOpacity style={styles.container}>
      <Text style={styles.text}>+ Add media or poll</Text>
    </TouchableOpacity>
  );
};

export default ButtonAddMedia;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.alto,
    borderRadius: 8,
    borderStyle: 'dashed',
  },
  text: {
    color: colors.black,
    fontFamily: fonts.inter[600],
    fontSize: 14,
    fontWeight: 'bold',
  },
});
