import * as React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';

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

Btn.propTypes = {
  children: PropTypes.node
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#00ADB5',
    paddingHorizontal: 25,
    borderRadius: 8,
    flexDirection: 'row',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: fonts.inter[600]
  },
  disabledbutton: {
    backgroundColor: colors.gray1
  }
});

export default Btn;
