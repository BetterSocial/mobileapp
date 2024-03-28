import React from 'react';
import {Animated, StyleSheet, Text, Easing, Dimensions, View, TouchableOpacity} from 'react-native';
import {getSpecificCache, saveToCache} from '../../utils/cache';
import {OPEN_FIRST_TIME} from '../../utils/cache/constant';
import {COLORS} from '../../utils/theme';

const WarningAnimatedMessage = ({isSHow, top = 100, left = 110}) => {
  const [isRunAnimate, setIsRunAnimated] = React.useState(false);
  const opacity = React.useRef(new Animated.Value(0)).current;
  const {width} = Dimensions.get('window');
  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  const handleAnimated = () => {
    if (isRunAnimate) {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
          delay: 8000
        })
      ]).start(() => {
        setIsRunAnimated(false);
        saveToCache(OPEN_FIRST_TIME, {isOpen: true});
      });
    }
  };

  const onAnimatedClose = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 1000,
      easing: Easing.ease,
      useNativeDriver: true
    }).start(() => {
      setIsRunAnimated(false);
      saveToCache(OPEN_FIRST_TIME, {isOpen: true});
    });
  };

  const translateX = opacity.interpolate({
    inputRange: [0, 1],
    outputRange: [width, 0]
  });

  React.useEffect(() => {
    handleAnimated();
  }, [isRunAnimate]);

  React.useEffect(() => {
    getSpecificCache(OPEN_FIRST_TIME, (cache) => {
      if (!cache?.isOpen) setIsRunAnimated(isSHow);
    });
  }, [isSHow]);

  return (
    <>
      <AnimatedTouchable
        onPress={onAnimatedClose}
        activeOpacity={1}
        style={[
          styles.parentContainer,
          {
            opacity,
            display: isRunAnimate ? 'flex' : 'none',
            position: isRunAnimate ? 'absolute' : 'relative'
          }
        ]}>
        <Animated.View
          style={[
            styles.triangle,
            {top: top - 10, right: left - 80, opacity, transform: [{translateX}]}
          ]}
        />
        <Animated.View
          style={[
            {opacity, display: isRunAnimate ? 'flex' : 'none', transform: [{translateX}]},
            styles.container,
            {top, left}
          ]}>
          <Text>
            Even when posts are incognito, you can be 🚫blocked, which will affect your visibility
            in the future. Respectful & balanced posts do best on Better.
          </Text>
        </Animated.View>
      </AnimatedTouchable>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    elevation: 1,
    borderRadius: 8,
    width: 259,
    backgroundColor: COLORS.white,
    borderColor: COLORS.concrete,
    borderWidth: 1
  },
  parentContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
    width: '100%',
    height: '100%'
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: COLORS.transparent,
    borderStyle: 'solid',
    borderTopWidth: 0,
    borderRightWidth: 10,
    borderBottomWidth: 20,
    borderLeftWidth: 10,
    borderTopColor: COLORS.transparent,
    borderRightColor: COLORS.transparent,
    borderBottomColor: COLORS.concrete,
    borderLeftColor: COLORS.transparent,
    position: 'absolute'
  }
});

export default WarningAnimatedMessage;
