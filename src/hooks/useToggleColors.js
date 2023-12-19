import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity} from 'react-native';
import ToggleSwitch from '../components/ToggleSwitch';
import {COLORS} from '../utils/theme';

const styles = StyleSheet.create({
  toggleSwitchContainer: {display: 'flex', alignSelf: 'flex-end', paddingVertical: 10}
});

const Colors = {
  anon: {
    primary: COLORS.holyTosca,
    secondary: COLORS.holyToscaSecondary,
    text: COLORS.white
  },
  signed: {
    primary: COLORS.blue,
    secondary: COLORS.blueSecondary,
    text: COLORS.white
  }
};

export const useDynamicColors = (isAnon) => {
  const status = isAnon ? 'anon' : 'signed';
  return Colors[status];
};

export const ToggleSwitchAnon = ({value, onValueChange, labelLeft, labelColor}) => {
  const dynamicColors = useDynamicColors(value);
  return (
    <TouchableOpacity onPress={onValueChange} style={styles.toggleSwitchContainer}>
      <ToggleSwitch
        value={value}
        onValueChange={onValueChange}
        labelLeft={labelLeft || 'Anonimity'}
        circleActiveColor={dynamicColors.primary}
        circleInActiveColor={dynamicColors.primary}
        activeTextColor={dynamicColors.primary}
        inactiveTextColor={dynamicColors.primary}
        styleLabelLeft={{color: labelColor || dynamicColors.text}}
      />
    </TouchableOpacity>
  );
};

ToggleSwitchAnon.propTypes = {
  value: PropTypes.bool,
  onValueChange: PropTypes.node,
  labelLeft: PropTypes.string,
  labelColor: PropTypes.string
};
