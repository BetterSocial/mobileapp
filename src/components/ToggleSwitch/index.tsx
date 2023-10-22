import * as React from 'react';
import {StyleProp, StyleSheet, Text, View, TextProps} from 'react-native';
import {Switch} from 'react-native-switch';

interface ToggleSwitchProps {
  value?: boolean;
  labelLeft?: string;
  labelRight?: string;
  circleActiveColor?: string;
  circleInActiveColor?: string;
  backgroundActive?: string;
  backgroundInactive?: string;
  styleLabelLeft?: StyleProp<TextProps>;
  styleLabelRight?: StyleProp<TextProps>;
  activeTextColor?: string;
  inactiveTextColor?: string;
  onValueChange?: (value: boolean) => void;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  containerSwitch: {
    borderWidth: 1,
    width: 42,
    height: 20,
    borderColor: 'rgba(28, 26, 55, 0.11)',
    shadowColor: 'rgba(28, 26, 55, 0.11)',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2
  },
  labelLeft: {
    marginRight: 5,
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '400'
  },
  labelRight: {
    marginLeft: 5,
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '400'
  },
  innerCircleActive: {
    width: 16,
    height: 16,
    borderWidth: 0,
    position: 'absolute',
    right: 18.9
  },
  innerCircleInactive: {
    width: 16,
    height: 16,
    borderWidth: 0,
    position: 'absolute',
    left: 17
  },
  activeText: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Inter',
    position: 'absolute',
    left: -10
  },
  inactiveText: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Inter',
    position: 'absolute',
    right: -10
  }
});

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  value,
  onValueChange,
  labelLeft,
  labelRight,
  circleActiveColor = '#00ADB5',
  circleInActiveColor = '#2C67BC',
  backgroundActive = '#F5F5F5',
  backgroundInactive = '#F5F5F5',
  styleLabelLeft,
  styleLabelRight,
  activeTextColor = '#00ADB5',
  inactiveTextColor = '#2C67BC'
}) => {
  return (
    <View style={styles.container}>
      {labelLeft && <Text style={[styles.labelLeft, styleLabelLeft]}>{labelLeft}</Text>}
      <Switch
        value={value}
        onValueChange={onValueChange}
        backgroundActive={backgroundActive}
        backgroundInactive={backgroundInactive}
        circleActiveColor={circleActiveColor}
        circleInActiveColor={circleInActiveColor}
        innerCircleStyle={value ? styles.innerCircleActive : styles.innerCircleInactive}
        activeTextStyle={[styles.activeText, {color: activeTextColor}]}
        inactiveTextStyle={[styles.inactiveText, {color: inactiveTextColor}]}
        activeText="On"
        inActiveText="Off"
        barHeight={20}
        switchWidthMultiplier={1.4}
        containerStyle={styles.containerSwitch}
      />
      {labelRight && <Text style={[styles.labelRight, styleLabelRight]}>{labelRight}</Text>}
    </View>
  );
};

export default ToggleSwitch;
