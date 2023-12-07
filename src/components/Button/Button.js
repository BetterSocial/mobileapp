import * as React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';

import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import dimen from '../../utils/dimen';

const Btn = (props) => {
  const disable = props.disabled ? props.disabled : false;
  const disabledStyle = props.disabled ? styles.disabledbutton : {};
  return (
    <TouchableOpacity
      disabled={disable}
      style={{...styles.button, ...props.btnStyle, ...props.styles, ...disabledStyle}}
      onPress={props.onPress}
      {...props}>
      <Text style={{...styles.buttonText, ...props.textStyling}}>{props.children}</Text>
    </TouchableOpacity>
  );
};

Btn.propTypes = {
  disabled: PropTypes.bool,
  children: PropTypes.node,
  onPress: PropTypes.func,
  styles: PropTypes.object,
  textStyling: PropTypes.object,
  btnStyle: PropTypes.object
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.signed_primary,
    paddingHorizontal: dimen.normalizeDimen(25),
    borderRadius: dimen.normalizeDimen(8),
    flexDirection: 'row',
    height: dimen.normalizeDimen(50),
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: fonts.inter[600]
  },
  disabledbutton: {
    backgroundColor: colors.gray1,
    borderRadius: dimen.normalizeDimen(8)
  }
});

export default Btn;
