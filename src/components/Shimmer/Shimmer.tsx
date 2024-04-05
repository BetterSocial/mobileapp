import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';
import {COLORS} from '../../utils/theme';

export const Shimmer = ({width = 300, height = 200}) => {
  const translateX = useSharedValue(-width);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(width * 2, {
        duration: 1500,
        easing: Easing.linear
      }),
      -1,
      true
    );
  }, [translateX, width]);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value}]
  }));

  return (
    <View style={[styles.container, {width, height}]}>
      <Animated.View style={[styles.gradientContainer, animatedStyles]}>
        <LinearGradient
          colors={[COLORS.almostBlack, COLORS.gray110]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={{width: width * 2, height}}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden'
  },
  gradientContainer: {
    width: '200%', // This is relative to the parent container's width
    position: 'absolute'
  }
});
