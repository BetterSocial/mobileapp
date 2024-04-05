import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {COLORS} from '../../utils/theme';

const Dot = ({size = 4, color}) => (
  <View testID="dot" style={[styles.point, {width: size, height: size, backgroundColor: color}]} />
);

export default Dot;

const styles = StyleSheet.create({
  point: {
    borderRadius: 4,
    backgroundColor: COLORS.gray400
  }
});
