import * as React from 'react';
import {
  StyleSheet,
  Animated,
  TouchableOpacity,
  Easing,
  StyleProp,
  Text,
  TextStyle,
  Platform,
  TouchableOpacityProps
} from 'react-native';
import dimen from '../../utils/dimen';
import {normalizeFontSize} from '../../utils/fonts';
import {COLORS} from '../../utils/theme';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  basicStyle: {
    height: dimen.normalizeDimen(16),
    width: dimen.normalizeDimen(16),
    borderRadius: dimen.normalizeDimen(16 / 2),
    backgroundColor: COLORS.signed_primary,
    position: 'absolute',
    top: dimen.normalizeDimen(2),
    bottom: dimen.normalizeDimen(2),
    left: dimen.normalizeDimen(2),
    right: dimen.normalizeDimen(2),
    justifyContent: 'center',
    alignItems: 'center'
  },
  textOn: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: normalizeFontSize(12),
    lineHeight: dimen.normalizeDimen(18),
    textAlign: 'center',
    textAlignVertical: 'center',
    color: COLORS.whiteSmoke,
    position: 'absolute',
    top: dimen.normalizeDimen(1),
    left: dimen.normalizeDimen(2),
    width: dimen.normalizeDimen(22),
    height: dimen.normalizeDimen(18)
  },
  textOff: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: normalizeFontSize(12),
    lineHeight: dimen.normalizeDimen(18),
    textAlign: 'center',
    textAlignVertical: 'center',
    color: COLORS.whiteSmoke,
    position: 'absolute',
    top: dimen.normalizeDimen(1),
    right: dimen.normalizeDimen(2),
    width: dimen.normalizeDimen(22),
    height: dimen.normalizeDimen(18)
  },
  mainStyes: {
    position: 'relative',
    borderRadius: dimen.normalizeDimen(12),
    backgroundColor: COLORS.lightgrey,
    height: dimen.normalizeDimen(20),
    width: dimen.normalizeDimen(42),
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.25)',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: dimen.normalizeDimen(1),
        shadowRadius: dimen.normalizeDimen(1)
      },
      android: {
        elevation: dimen.normalizeDimen(1)
      }
    })
  },
  labelLeft: {
    marginRight: dimen.normalizeDimen(5),
    color: COLORS.white,
    fontSize: normalizeFontSize(12),
    fontWeight: '400'
  },
  labelRight: {
    marginLeft: dimen.normalizeDimen(5),
    color: COLORS.white,
    fontSize: normalizeFontSize(12),
    fontWeight: '400'
  }
});

interface ToggleSwitchProps {
  value?: boolean;
  labelLeft?: string;
  labelRight?: string;
  circleActiveColor?: string;
  circleInActiveColor?: string;
  backgroundActive?: string;
  backgroundInactive?: string;
  styleLabelLeft?: StyleProp<TextStyle>;
  styleLabelRight?: StyleProp<TextStyle>;
  activeTextColor?: string;
  inactiveTextColor?: string;
  containerStyle?: TouchableOpacityProps['style'];
  labelOff?: string;
  labelOn?: string;
  onValueChange?: (value: boolean) => void;
  isViewOnly?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  value = false,
  onValueChange,
  labelLeft,
  labelRight,
  circleActiveColor = COLORS.anon_primary,
  circleInActiveColor = COLORS.signed_primary,
  backgroundActive = COLORS.lightgrey,
  backgroundInactive = COLORS.lightgrey,
  styleLabelLeft,
  styleLabelRight,
  activeTextColor = COLORS.anon_primary,
  inactiveTextColor = COLORS.signed_primary,
  containerStyle,
  labelOff = 'Off',
  labelOn = 'On',
  isViewOnly = false
}) => {
  const positionButton = React.useMemo(() => new Animated.Value(0), []);

  const startAnimToOff = () => {
    Animated.timing(positionButton, {
      toValue: 0,
      duration: 150,
      easing: Easing.ease,
      useNativeDriver: false
    }).start();
  };

  const startAnimToOn = () => {
    Animated.timing(positionButton, {
      toValue: 1,
      duration: 150,
      easing: Easing.ease,
      useNativeDriver: false
    }).start();
  };

  const positionInterPol = positionButton.interpolate({
    inputRange: [0, 1],
    outputRange: [0, dimen.normalizeDimen(22)]
  });
  const backgroundColorAnim = positionButton.interpolate({
    inputRange: [0, 1],
    outputRange: [backgroundInactive, backgroundActive]
  });

  const initialOpacityOn = positionButton.interpolate({inputRange: [0, 1], outputRange: [0, 1]});
  const initialOpacityOff = positionButton.interpolate({inputRange: [0, 1], outputRange: [1, 0]});

  const onPress = () => {
    if (!value) {
      startAnimToOff();
    } else {
      startAnimToOn();
    }
    if (onValueChange) onValueChange(!value);
  };

  if (value) {
    startAnimToOn();
  } else {
    startAnimToOff();
  }

  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      activeOpacity={0.9}
      onPress={onPress}
      disabled={isViewOnly}>
      {labelLeft && <Text style={[styles.labelLeft, styleLabelLeft]}>{labelLeft}</Text>}
      <Animated.View
        style={[
          styles.mainStyes,
          {
            backgroundColor: backgroundColorAnim
          }
        ]}>
        <Animated.Text
          style={[
            styles.textOn,
            {
              opacity: initialOpacityOn,
              color: activeTextColor
            }
          ]}>
          {labelOn}
        </Animated.Text>
        <Animated.Text
          style={[
            styles.textOff,
            {
              opacity: initialOpacityOff,
              color: inactiveTextColor
            }
          ]}>
          {labelOff}
        </Animated.Text>
        <Animated.View
          style={[
            styles.basicStyle,
            {
              transform: [
                {
                  translateX: positionInterPol
                }
              ],
              backgroundColor: positionButton.interpolate({
                inputRange: [0, 1],
                outputRange: [circleInActiveColor, circleActiveColor]
              })
            }
          ]}
        />
      </Animated.View>
      {labelRight && <Text style={[styles.labelRight, styleLabelRight]}>{labelRight}</Text>}
    </TouchableOpacity>
  );
};

export default ToggleSwitch;
