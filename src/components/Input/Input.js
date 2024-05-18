import * as React from 'react';
import {Dimensions, StyleSheet, TextInput} from 'react-native';
import {COLORS} from '../../utils/theme';

const {width} = Dimensions.get('screen');

const Input = ({...props}) => (
  <TextInput style={styles.input} keyboardAppearance="dark" {...props} />
);

export default Input;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: COLORS.gray210,
    paddingHorizontal: 23,
    paddingVertical: 13,
    width: width - 100
  }
});
