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
          colors={['#e0e0e0', '#c0c0c0', '#e0e0e0']}
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
    overflow: 'hidden',
    backgroundColor: '#e0e0e0'
  },
  gradientContainer: {
    width: '200%', // This is relative to the parent container's width
    position: 'absolute'
  }
});
