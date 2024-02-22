import * as React from 'react';
import {Dimensions, Image, StyleSheet, TouchableWithoutFeedback, View} from 'react-native';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BgOnboardingTop from '../../../assets/background/bg_onboarding_top.png';
import BottomOverlay from './BottomOverlay';
import dimen from '../../../utils/dimen';
import {fonts, normalize} from '../../../utils/fonts';

const {height, width} = Dimensions.get('screen');

export const SlideShowItem = ({
  count,
  handleLogin,
  illustration,
  index,
  isLogin,
  title,
  text,
  textSvg,
  onNextSlide = () => {},
  onPressContainer = () => {}
}) => {
  const [heightTopContainer, setHeightContainer] = React.useState(
    height - dimen.size.ONBOARDING_BOTTOM_OVERLAY_CONTAINER
  );
  const {top} = useSafeAreaInsets();
  // eslint-disable-next-line no-underscore-dangle
  const __renderForeground = () => {
    if (index < 4)
      return (
        <TouchableWithoutFeedback onPress={onPressContainer}>
          <Image
            source={illustration}
            style={styles.onboardingForeground(heightTopContainer, top)}
          />
        </TouchableWithoutFeedback>
      );
    return <></>;
  };

  // eslint-disable-next-line no-underscore-dangle
  const __onNextSlide = () => {
    onNextSlide(index + 1);
  };

  // eslint-disable-next-line no-underscore-dangle
  const __renderBackground = () => {
    // if (index < 4) return <Image source={BgOnboarding} style={styles.onboardingBackground} />
    if (index < 4) return <></>;
    return (
      <TouchableWithoutFeedback onPress={onPressContainer}>
        <View style={styles.onboardingBackgroundTopContainer}>
          <Image source={BgOnboardingTop} style={styles.onboardingBackgroundTop} />
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={styles.topPartContainer}
        onLayout={(event) => {
          const heightContainer = event.nativeEvent.layout.height;
          setHeightContainer(heightContainer);
        }}>
        {__renderForeground()}
        {__renderBackground()}
      </View>
      <BottomOverlay
        count={count}
        handleLogin={handleLogin}
        isLogin={isLogin}
        text={text}
        textSvg={textSvg}
        title={title}
        index={index}
        onNextSlide={__onNextSlide}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width
  },
  slideShowItemContainer: (backgroundColor, maxWidth) => {
    return {
      justifyContent: 'center',
      flex: 1,
      backgroundColor,
      maxWidth,
      marginTop: -32
    };
  },
  onboardingForeground: (heightContainer, topArea) => ({
    position: 'absolute',
    top: topArea <= 20 ? -topArea : normalize(topArea - 60),
    zIndex: 1,
    width,
    height: heightContainer + (topArea <= 20 ? topArea : normalize(60 - topArea)),
    resizeMode: 'cover'
  }),
  onboardingBackground: {
    width: '100%',
    height: '100%'
  },
  onboardingBackgroundTop: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute'
  },
  onboardingBackgroundTopContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  title: {
    fontSize: 18,
    lineHeight: 12.5,
    fontFamily: fonts.inter[600],
    zIndex: 1000,
    paddingTop: 5,
    marginTop: 18,
    textAlign: 'center',
    alignSelf: 'center'
  },
  text: (lineHeight) => {
    return {
      fontSize: 14.0,
      lineHeight,
      marginLeft: 12,
      marginRight: 12,
      marginTop: 16,
      fontFamily: fonts.inter[500],
      zIndex: 1000,
      textAlign: 'center'
    };
  },
  topPartContainer: {
    flex: 1
  }
});
