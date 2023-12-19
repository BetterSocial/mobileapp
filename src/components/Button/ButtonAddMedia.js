import * as React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

import {colors} from '../../utils/colors';

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
    borderColor: colors.alto,
    borderRadius: 8,
    borderStyle: 'dashed',
  },
});
