import * as React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import dimen from '../../utils/dimen';

const Btn = (props) => {
  const disable = props.disabled ? props.disabled : false;
  const disabledStyle = props.disabled ? styles.disabledbutton : {};
  return (
    <TouchableOpacity disabled={disable} onPress={props.onPress} {...props}>
      <View style={{...styles.button, ...props.style, ...disabledStyle}}>
        <Text style={{...styles.buttonText, ...props.textStyling}}>{props.children}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#00ADB5',
    paddingHorizontal: dimen.normalizeDimen(25),
    borderRadius: dimen.normalizeDimen(8),
    flexDirection: 'row',
    height: dimen.normalizeDimen(50),
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: fonts.inter[600]
  },
  disabledbutton: {
    backgroundColor: colors.gray1,
    borderRadius: dimen.normalizeDimen(8)
  }
});

export default Btn;
