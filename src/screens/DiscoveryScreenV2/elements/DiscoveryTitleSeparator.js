import * as React from 'react';
import {Animated, Text, View} from 'react-native';
import ArrowDown from '../../../../assets/icons/arrow-down.svg';
import {fonts} from '../../../utils/fonts';
import {COLORS} from '../../../utils/theme';

/**
 * @typedef {Object} DiscoveryTitleSeparatorProp
 * @property {String} text
 * @property {Boolean} showArrow
 * @property {Boolean} [rotateArrow]
 * @property {Boolean} [withBorderBottom]
 */
/**
 *
 * @param {DiscoveryTitleSeparatorProp} props
 */
const DiscoveryTitleSeparator = (props) => {
  const {text, showArrow, rotateArrow, withBorderBottom = false} = props;

  // Animation value for rotation
  const rotation = React.useRef(new Animated.Value(rotateArrow ? 1 : 0)).current;

  // Interpolating the animation value to create a rotation style
  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'] // Rotate 180 degrees
  });

  // Trigger rotation animation if `rotateArrow` changes
  React.useEffect(() => {
    Animated.timing(rotation, {
      toValue: rotateArrow ? 1 : 0,
      duration: 300, // Adjust as needed
      useNativeDriver: true
    }).start();
  }, [rotateArrow]);

  return (
    <View
      style={{
        borderBottomColor: withBorderBottom ? COLORS.gray210 : 'transparent',
        borderBottomWidth: withBorderBottom ? 1 : 0,
        backgroundColor: COLORS.gray110,
        justifyContent: 'space-between',
        alignContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingRight: 20
      }}>
      <Text
        style={{
          fontSize: 12,
          lineHeight: 18,
          fontFamily: fonts.poppins[600],
          color: COLORS.white,
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 11,
          paddingBottom: 11
        }}>
        {text}
      </Text>
      {showArrow && (
        <Animated.View style={{transform: [{rotate}]}}>
          <ArrowDown />
        </Animated.View>
      )}
    </View>
  );
};

export default DiscoveryTitleSeparator;
