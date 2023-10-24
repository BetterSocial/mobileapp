import * as React from 'react';
import {Dimensions, StyleSheet, Text} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {SwiperFlatList} from 'react-native-swiper-flatlist';

import FgOnboarding1 from '../../../assets/background/fg_onboarding_full_1.png';
import FgOnboarding2 from '../../../assets/background/fg_onboarding_full_2.png';
import FgOnboarding3 from '../../../assets/background/fg_onboarding_full_3.png';
import FgOnboarding4 from '../../../assets/background/fg_onboarding_full_4.png';
import OnboardingText1 from '../../../assets/onboarding/OnboardingText1';
import OnboardingText2 from '../../../assets/onboarding/OnboardingText2';
import OnboardingText3 from '../../../assets/onboarding/OnboardingText3';
import OnboardingText4 from '../../../assets/onboarding/OnboardingText4';
import {COLORS} from '../../../utils/theme';
import {SlideShowItem} from './SlideShowItem';
import {fonts} from '../../../utils/fonts';

const {fontScale} = Dimensions.get('window');

const SlideShow = ({handleLogin, onContainerPress = () => {}}) => {
  const flatListRef = React.useRef(null);

  const data = [
    {
      illustrations: FgOnboarding1,
      title: 'Go Incognito with a Tap',
      // textSvg: <OnboardingText1 preserveAspectRatio="xMinYMin meet" width={292 - 32}/>,
      textSvg: <OnboardingText1 preserveAspectRatio="xMinYMin meet" width={'100%'} />,
      text: (
        <Text style={slideShowStyles.textFontNormal}>
          <Text style={slideShowStyles.textFontBold}>{'Post, comment and chat anonymously. '}</Text>
          {'We’ll'}
          {'\n'}

          {'never reveal your username, and you’ll be'}
          {'\n'}

          {'assigned a different random emoji for every'}
          {'\n'}

          {'post, comment or message.'}
          {'\n'}

          {'So go ahead and '}
          <Text style={slideShowStyles.textFontBold}>{'say what you really thisnk!'}</Text>
        </Text>
      )
    },
    {
      illustrations: FgOnboarding2,
      title: 'Get Anonymous Messages',
      // textSvg: <OnboardingText2 preserveAspectRatio="xMinYMin meet" width={297 - 32}/>,
      textSvg: <OnboardingText2 preserveAspectRatio="xMinYMin meet" width={'100%'} />,
      text: (
        <Text style={slideShowStyles.textFontNormal}>
          {'Share your link on other platforms to receive'}
          {'\n'}

          {'anonymous messages from your friends. '}
          <Text style={slideShowStyles.textFontBold}>{'Ask'}</Text>
          {'\n'}

          <Text style={slideShowStyles.textFontBold}>{'for advice, feedback, and more!'}</Text>
          {'\n'}

          {'As always, abuse can be blocked in two clicks.'}
        </Text>
      )
    },
    {
      illustrations: FgOnboarding3,
      title: 'Find Your Community',
      // textSvg: <OnboardingText3 preserveAspectRatio="xMinYMin meet" width={303 - 32}/>,
      textSvg: <OnboardingText3 preserveAspectRatio="xMinYMin meet" width={'100%'} />,
      text: (
        <Text style={slideShowStyles.textFontNormal}>
          {'Posting into a community is as easy as using a'}
          {'\n'}

          <Text style={slideShowStyles.textFontBold}>{'#hashtag. '}</Text>
          {'Add '}
          <Text style={slideShowStyles.textFontBold}>{'#communities '}</Text>
          {'to your posts to'}
          {'\n'}

          {'reach more people.'}
          {'\n'}

          {'Follow friends and communities to start and'}
          {'\n'}

          {'join conversations.'}
        </Text>
      )
    },
    {
      illustrations: FgOnboarding4,
      title: 'Don’t Miss Anything',
      // textSvg: <OnboardingText4 preserveAspectRatio="xMinYMin meet" width={306 - 32}/>,
      textSvg: <OnboardingText4 preserveAspectRatio="xMinYMin meet" width={'100%'} />,
      text: (
        <Text style={slideShowStyles.textFontNormal}>
          {'Chats, posts, comments, and communities:'}
          {'\n'}

          {'Find all your conversations separated between'}
          {'\n'}

          {'your anonymous and your public activity.'}
          {'\n'}

          <Text style={slideShowStyles.textFontBold}>{'Avoid notification spam '}</Text>
          {'and check what’s'}
          {'\n'}

          {'new, all in one place.'}
        </Text>
      )
    },
    {
      isLogin: true,
      illustrations: FgOnboarding1,
      title: 'Be Safe',
      text: <Text style={slideShowStyles.textFontNormal}></Text>
    }
  ];
  const handleChangeIndex = (swiperData) => {
    // onChangeNewIndex(swiperData, data.length);
    flatListRef.current.scrollToIndex({index: swiperData.index});
    // setIndex(swiperData.index)
  };

  const onHandleNextSlide = (toIndex) => {
    flatListRef.current.scrollToIndex({index: toIndex});
  };

  return (
    <SwiperFlatList
      ref={flatListRef}
      index={0}
      data={data}
      scroll
      renderItem={({item, index}) => (
        <SlideShowItem
          index={index}
          onPressContainer={onContainerPress}
          key={`slideshowitem-${index}`}
          count={data.length}
          handleLogin={handleLogin}
          illustration={item.illustrations}
          isLogin={item.isLogin}
          onNextSlide={onHandleNextSlide}
          text={item.text}
          title={item.title}
          textSvg={item.textSvg}
        />
      )}
      onChangeIndex={handleChangeIndex}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 1,
        minimumViewTime: 10
      }}
    />
  );
};

export default SlideShow;

const slideShowStyles = StyleSheet.create({
  textFontBold: {
    fontFamily: fonts.inter[700],
    fontSize: fontScale < 1 ? RFValue(16, 812) : RFValue(14, 812),
    lineHeight: fontScale < 1 ? RFValue(22) : RFValue(20),
    color: COLORS.blackgrey
  },
  textFontNormal: {
    fontFamily: fonts.inter[400],
    fontSize: fontScale < 1 ? RFValue(16, 812) : RFValue(14, 812),
    lineHeight: fontScale < 1 ? RFValue(22) : RFValue(20),
    color: COLORS.blackgrey,
    flex: 1,
    alignSelf: 'flex-start',
    marginRight: 32,
    zIndex: 1000
  }
});
