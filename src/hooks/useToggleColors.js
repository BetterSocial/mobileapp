import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {colors} from '../utils/colors';
import ToggleSwitch from '../components/ToggleSwitch';

const styles = StyleSheet.create({
  toggleSwitchContainer: {display: 'flex', alignSelf: 'flex-end', paddingVertical: 10}
});

const Colors = {
  anon: {
    primary: colors.anon_primary,
    secondary: colors.anon_secondary,
    text: colors.white
  },
  signed: {
    primary: colors.signed_primary,
    secondary: colors.signed_secondary,
    text: colors.white
  }
};

export const useDynamicColors = (isAnon) => {
  const status = isAnon ? 'anon' : 'signed';
  return Colors[status];
};

export const ToggleSwitchAnon = ({value, onValueChange, labelLeft}) => {
  const dynamicColors = useDynamicColors(value);
  return (
    <TouchableOpacity onPress={onValueChange} style={styles.toggleSwitchContainer}>
      <ToggleSwitch
        value={value}
        onValueChange={onValueChange}
        labelLeft={labelLeft || 'Anonimity'}
        circleActiveColor={dynamicColors.primary}
        activeTextColor={dynamicColors.primary}
        styleLabelLeft={{color: dynamicColors.text}}
      />
    </TouchableOpacity>
  );
};

ToggleSwitchAnon.propTypes = {
  value: PropTypes.bool,
  onValueChange: PropTypes.node,
  labelLeft: PropTypes.string
};
