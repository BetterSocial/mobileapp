import React from 'react';
import {View, Text, StyleSheet, TouchableNativeFeedback} from 'react-native';

const Btn = (props) => {
  let disable = props.disabled ? props.disabled : false;
  return (
    <TouchableNativeFeedback disabled={disable} onPress={props.onPress}>
      <View style={{...styles.button, ...props.style}}>
        <Text style={{...styles.buttonText, ...props.textStyling}}>
          {props.children}
        </Text>
      </View>
    </TouchableNativeFeedback>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#00ADB5',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    flexDirection: 'row',
    height: 48,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '600',
  },
});

export default Btn;
