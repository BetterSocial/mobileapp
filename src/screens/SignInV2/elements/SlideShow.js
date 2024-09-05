import * as React from 'react';
import PropTypes from 'prop-types';
import {Dimensions, StyleSheet, Text} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {SwiperFlatList} from 'react-native-swiper-flatlist';

import FgOnboarding1 from '../../../assets/background/fg_onboarding_full_1.png';
import FgOnboarding2 from '../../../assets/background/fg_onboarding_full_2.png';
import FgOnboarding3 from '../../../assets/background/fg_onboarding_full_3.png';
import FgOnboarding4 from '../../../assets/background/fg_onboarding_full_4.png';
import {COLORS} from '../../../utils/theme';
import {SlideShowItem} from './SlideShowItem';
import {fonts} from '../../../utils/fonts';

const {fontScale} = Dimensions.get('window');

const SlideShow = ({handleLogin, onContainerPress = () => {}}) => {
  const flatListRef = React.useRef(null);

  const data = [
    // {
    //   illustrations: FgOnboarding1,
    //   title: 'Go Incognito with a Tap',
    //   text: (
    //     <Text>
    //       {'Post, comment and chat with or without'}
    //       {'\n'}

    //       {'revealing your username - it’s up to you!'}
    //       {'\n'}

    //       {'So go ahead and say what you really think!'}
    //     </Text>
    //   )
    // },
    // {
    //   illustrations: FgOnboarding2,
    //   title: 'Better Karma, Higher Visibility',
    //   text: (
    //     <Text>
    //       {'Karma scores help the community stay'}
    //       {'\n'}

    //       {'accountable even when in Incognito Mode.'}
    //       {'\n'}

    //       {'To increase your score, just invite followers,'}
    //       {'\n'}

    //       {'create posts and avoid being blocked!'}
    //     </Text>
    //   )
    // },
    // {
    //   illustrations: FgOnboarding3,
    //   title: 'Find Your #community',
    //   text: (
    //     <Text>
    //       {'Create or post in communities just by using a'}
    //       {'\n'}

    //       {'hashtags. To protect your privacy, '}
    //       {'\n'}

    //       {'communities can be joined incognito as well!'}
    //     </Text>
    //   )
    // },
    // {
    //   illustrations: FgOnboarding4,
    //   title: 'Don’t Miss Anything',
    //   text: (
    //     <Text>
    //       {'Chats, posts, comments, and communities:'}
    //       {'\n'}

    //       {'Find all your conversations, separated'}
    //       {'\n'}

    //       {'between your incognito and your public'}
    //       {'\n'}

    //       {'activity.'}
    //     </Text>
    //   )
    // },
    {
      isLogin: true,
      illustrations: FgOnboarding1
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

SlideShow.propTypes = {
  handleLogin: PropTypes.func,
  onContainerPress: PropTypes.func
};

export default SlideShow;

const slideShowStyles = StyleSheet.create({
  textFontBold: {
    fontFamily: fonts.inter[700],
    fontSize: fontScale < 1 ? RFValue(16, 812) : RFValue(14, 812),
    lineHeight: fontScale < 1 ? RFValue(22) : RFValue(20),
    color: COLORS.gray410
  },
  textFontNormal: {
    fontFamily: fonts.inter[400],
    fontSize: fontScale < 1 ? RFValue(16, 812) : RFValue(14, 812),
    lineHeight: fontScale < 1 ? RFValue(22) : RFValue(20),
    color: COLORS.gray410,
    flex: 1,
    alignSelf: 'flex-start',
    marginRight: 32,
    zIndex: 1000
  }
});
