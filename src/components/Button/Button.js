import * as React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';

import {fonts} from '../../utils/fonts';
import dimen from '../../utils/dimen';
import {COLORS} from '../../utils/theme';

const Btn = (props) => {
  const disable = props.disabled ? props.disabled : false;
  const disabledStyle = props.disabled ? styles.disabledbutton : {};
  return (
    <TouchableOpacity
      disabled={disable}
      style={{...styles.button, ...props.styles, ...disabledStyle}}
      onPress={props.onPress}
      {...props}>
      <Text
        style={[
          {...styles.buttonText, ...props.textStyling},
          disable ? styles.buttonTextDisabled : {}
        ]}>
        {props.children}
      </Text>
    </TouchableOpacity>
  );
};

Btn.propTypes = {
  disabled: PropTypes.bool,
  children: PropTypes.node,
  onPress: PropTypes.func,
  styles: PropTypes.object,
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
    color: COLORS.white2,
    fontSize: 18,
    fontFamily: fonts.inter[600]
  },
  buttonTextDisabled: {
    color: COLORS.gray310
  },
  disabledbutton: {
    backgroundColor: COLORS.gray200,
    borderRadius: dimen.normalizeDimen(8)
  }
});

export default Btn;
