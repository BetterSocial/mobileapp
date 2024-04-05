import * as React from 'react';
import {StyleSheet, TouchableOpacity, Animated, StyleProp} from 'react-native';

import MemoIc_pencil from '../../assets/icons/Ic_pencil';
import dimen from '../../utils/dimen';
import {COLORS} from '../../utils/theme';
import {fonts} from '../../utils/fonts';

/**
 *
 * @typedef {Object} BaseButtonAddPostProps
 * @property {StyleProp} buttonStyle
 * @property {boolean} isShowArrow
 *
 */

/**
 *
 * @param {BaseButtonAddPostProps} props
 */
const BaseButtonAddPost = ({
  onAddPostPressed = () => {},
  children = undefined,
  testID = null,
  containerStyle = {},
  buttonStyle,
  isShowArrow
}) => {
  const AnimatedButton = Animated.createAnimatedComponent(TouchableOpacity);
  const animatedRef = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (isShowArrow) {
      moveEditButton();
    } else {
      moveBackEditButton();
    }
  }, [isShowArrow]);

  const moveEditButton = () => {
    Animated.timing(animatedRef, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();
  };

  const moveBackEditButton = () => {
    Animated.timing(animatedRef, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true
    }).start();
  };

  const verticalPosValue = animatedRef.interpolate({
    inputRange: [0, 10],
    outputRange: [0, -750]
  });

  const renderChildren = children || (
    <MemoIc_pencil
      width={dimen.normalizeDimen(21)}
      height={dimen.normalizeDimen(21)}
      color={COLORS.white2}
      style={{
        alignSelf: 'center'
      }}
    />
  );

  const animationStyle = {
    transform: [
      {
        translateY: verticalPosValue
      }
    ]
  };

  const style = StyleSheet.flatten([styles.container, containerStyle]);

  return (
    <AnimatedButton
      testID={testID}
      style={[style, animationStyle, buttonStyle]}
      onPress={onAddPostPressed}>
      {renderChildren}
    </AnimatedButton>
  );
};

export default BaseButtonAddPost;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.signed_primary,
    width: dimen.size.FEED_ACTION_BUTTON_RADIUS,
    height: dimen.size.FEED_ACTION_BUTTON_RADIUS,
    borderRadius: dimen.size.FEED_ACTION_BUTTON_RADIUS,
    justifyContent: 'center'
  },
  text: {
    fontFamily: fonts.inter[500],
    color: COLORS.almostBlack,
    fontSize: 12,
    marginLeft: 9.67
  }
});
