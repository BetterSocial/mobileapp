import React from 'react';
import PropTypes from 'prop-types';
import {Animated, StyleSheet, Text, Easing, Dimensions, TouchableOpacity} from 'react-native';
import {COLORS} from '../../utils/theme';
import StorageUtils from '../../utils/storage';
import {fonts, normalizeFontSize} from '../../utils/fonts';

const WarningAnimatedMessage = ({isShow, top = 100, left = 110}) => {
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
        StorageUtils.incognitoCreatePostFirstTime.set('true');
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
      StorageUtils.incognitoCreatePostFirstTime.set('true');
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
    if (StorageUtils.incognitoCreatePostFirstTime.get() !== 'true') {
      setIsRunAnimated(isShow);
    }
  }, [isShow]);

  return (
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
        <Text style={styles.text}>
          Even when posts are incognito, you can be 🚫blocked, which will affect your visibility in
          the future. Respectful & balanced posts do best on Better.
        </Text>
      </Animated.View>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    elevation: 1,
    borderRadius: 8,
    width: 259,
    backgroundColor: COLORS.almostBlack,
    borderColor: COLORS.gray210,
    borderWidth: 1
  },
  // TODO: Garry overlay tidak sampai bawah
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
    borderBottomColor: COLORS.almostBlack,
    borderLeftColor: COLORS.transparent,
    position: 'absolute'
  },
  text: {
    fontFamily: fonts.inter[400],
    fontSize: normalizeFontSize(12),
    color: COLORS.white
  }
});

WarningAnimatedMessage.propTypes = {
  isShow: PropTypes.bool,
  top: PropTypes.number,
  left: PropTypes.number
};
export default WarningAnimatedMessage;
