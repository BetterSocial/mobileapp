import * as React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

import {COLORS} from '../../utils/theme';

const ButtonAddMedia = ({onPress, style, label, labelStyle}) => (
  <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
    <Text style={labelStyle}>{label}</Text>
  </TouchableOpacity>
);

export default ButtonAddMedia;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.gray100,
    borderRadius: 8,
    borderStyle: 'dashed'
  }
});
