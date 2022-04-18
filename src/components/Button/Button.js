import * as React from 'react';
import {View, Text, StyleSheet, TouchableNativeFeedback} from 'react-native';

import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';

const Btn = (props) => {
  let disable = props.disabled ? props.disabled : false;
  let disabledStyle = props.disabled ? styles.disabledbutton : {};
  return (
    <TouchableNativeFeedback disabled={disable} onPress={props.onPress}>
      <View style={{...styles.button, ...props.style, ...disabledStyle}}>
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
    paddingHorizontal: 25,
    borderRadius: 8,
    flexDirection: 'row',
    height: 50,
    justifyContent: 'center',
    alignItems:'center'
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: fonts.inter[600],
  },
  disabledbutton: {
    backgroundColor: colors.gray1,
  },
});

export default Btn;
