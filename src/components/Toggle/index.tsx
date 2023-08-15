import React, {useCallback} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useSharedValue, useAnimatedStyle, withTiming} from 'react-native-reanimated';

interface ToggleProps {
  activeColor?: string;
  inactiveColor?: string;
  activeButtonColor?: string;
  inactiveButtonColor?: string;
  onPress?: (value: boolean) => void;
  label?: string;
  labelStyle?: object;
  disabled?: boolean;
}

const Toggle: React.FC<ToggleProps> = ({
  activeColor = '#9DEDF1',
  inactiveColor = '#F5F5F5',
  activeButtonColor = '#00ADB5',
  inactiveButtonColor = '#E0E0E0',
  onPress,
  label,
  labelStyle,
  disabled = false
}) => {
  const isActive = useSharedValue(false);

  const handlePress = useCallback(() => {
    if (!disabled) {
      isActive.value = !isActive.value;
      onPress?.(isActive.value);
    }
  }, [disabled, isActive, onPress]);

  const containerStyle = useAnimatedStyle(() => ({
    backgroundColor: isActive.value ? activeColor : inactiveColor
  }));

  const toggleButtonStyle = useAnimatedStyle(() => ({
    transform: [{translateX: withTiming(isActive.value ? 15 : -15)}],
    backgroundColor: isActive.value ? activeButtonColor : inactiveButtonColor
  }));

  console.log('render');

  return (
    <TouchableOpacity style={styles.toggleWrapper} onPress={handlePress} disabled={disabled}>
      {label && <Text style={[styles.labelText, labelStyle]}>{label}</Text>}
      <View style={[styles.container, containerStyle]}>
        {!isActive.value && <Text style={styles.offText}>Off</Text>}
        <View style={[styles.toggleButton, toggleButtonStyle]} />
        {isActive.value && <Text style={styles.onText}>On</Text>}
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  toggleWrapper: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    padding: 2
  },
  toggleButton: {
    width: 16,
    height: 16,
    borderRadius: 15
  },
  labelText: {
    marginRight: 5
  },
  offText: {
    marginHorizontal: 3.5,
    color: '#E0E0E0',
    fontSize: 10
  },
  onText: {
    marginHorizontal: 3.5,
    color: '#00ADB5',
    fontSize: 10
  }
});

export default React.memo(Toggle);
