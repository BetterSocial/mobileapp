import * as React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';

import {fonts} from '../../utils/fonts';
import dimen from '../../utils/dimen';
import {COLORS} from '../../utils/theme';

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
  disabled: PropTypes.bool,
  children: PropTypes.node,
  onPress: PropTypes.func,
  style: PropTypes.object,
  textStyling: PropTypes.object
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.signed_primary,
    paddingHorizontal: dimen.normalizeDimen(25),
    borderRadius: dimen.normalizeDimen(8),
    flexDirection: 'row',
    height: dimen.normalizeDimen(50),
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: fonts.inter[600]
  },
  disabledbutton: {
    backgroundColor: COLORS.lightgrey,
    borderRadius: dimen.normalizeDimen(8)
  }
});

export default Btn;
