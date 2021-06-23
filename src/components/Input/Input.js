import * as React from 'react';
import {Dimensions, StyleSheet, TextInput} from 'react-native';

const width = Dimensions.get('screen').width;

const Input = ({...props}) => {
  return <TextInput style={styles.input} {...props} />;
};

export default Input;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#BDBDBD',
    paddingHorizontal: 23,
    paddingVertical: 13,
    width: width - 100,
  },
});
