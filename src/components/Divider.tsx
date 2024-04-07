import React from 'react';
import {View, StyleSheet, ViewProps} from 'react-native';
import {COLORS} from '../utils/theme';

export const Divider = (props: ViewProps) => {
  const {style} = props;
  return <View {...props} style={[styles.horizontalLine, style]} />;
};

const styles = StyleSheet.create({
  horizontalLine: {
    width: '100%',
    height: 0.5,
    backgroundColor: COLORS.gray510
  }
});
