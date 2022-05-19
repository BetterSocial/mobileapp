import * as React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { SwiperFlatList } from 'react-native-swiper-flatlist';

import FgOnboarding1 from '../../../assets/background/fg_onboarding_full_1.png';
import FgOnboarding2 from '../../../assets/background/fg_onboarding_full_2.png';
import FgOnboarding3 from '../../../assets/background/fg_onboarding_full_3.png';
import FgOnboarding4 from '../../../assets/background/fg_onboarding_full_4.png';
import OnboardingText1 from '../../../assets/onboarding/OnboardingText1';
import OnboardingText2 from '../../../assets/onboarding/OnboardingText2';
import OnboardingText3 from '../../../assets/onboarding/OnboardingText3';
import OnboardingText4 from '../../../assets/onboarding/OnboardingText4';
import { COLORS } from '../../../utils/theme';
import { SlideShowItem } from './SlideShowItem';
import { fonts, normalizeFontSize, scaleFontSize } from '../../../utils/fonts';

const { width: screenWidth, fontScale, scale } = Dimensions.get('window');
console.log(screenWidth)
console.log('\n')

const SlideShow = ({ onChangeNewIndex = (newIndex) => { }, handleLogin }) => {
  const [index, setIndex] = React.useState(0)

  const flatListRef = React.useRef(null)

  const data = [
    {
      illustrations: FgOnboarding1,
      title: 'Be yourself',
      // textSvg: <OnboardingText1 preserveAspectRatio="xMinYMin meet" width={292 - 32}/>,
      textSvg: <OnboardingText1 preserveAspectRatio="xMinYMin meet" width={'100%'}/>,
      text: <Text style={slideShowStyles.textFontNormal}>
        {`Say `}
        <Text style={slideShowStyles.textFontBold}>{`No `}</Text>
        {`to self-censorship & `}
        <Text style={slideShowStyles.textFontBold}>{`Yes `}</Text>
        {`to privacy!`}
        {`\n`}

        {`Post anonymously - if you want. All upvotes,`}
        {`\n`}

        {`downvotes, blocks and who you're following`}
        {`\n`}

        {`are `}
        <Text style={slideShowStyles.textFontBold}>{`always `}</Text>
        {`anonymous!`}
      </Text>,
    },
    {
      illustrations: FgOnboarding2,
      title: 'Be human',
      // textSvg: <OnboardingText2 preserveAspectRatio="xMinYMin meet" width={297 - 32}/>,
      textSvg: <OnboardingText2 preserveAspectRatio="xMinYMin meet" width={'100%'}/>,
      text: <Text style={slideShowStyles.textFontNormal}>
        <Text style={slideShowStyles.textFontBold}>{`Better `}</Text>
        {`blocks fake accounts, and won't spam `}
        {`\n`}

        {`you with irrelevant notifications.`}
        {`\n`}

        {`We believe that in a functioning community,`}
        {`\n`}

        {`everyone deserves `}
        <Text style={slideShowStyles.textFontBold}>{`one voice, `}</Text>
        {`not to be `}
        {`\n`}

        {`drowned by bots & automated posts.`}
      </Text>,
    },
    {
      illustrations: FgOnboarding3,
      title: 'Be real',
      // textSvg: <OnboardingText3 preserveAspectRatio="xMinYMin meet" width={303 - 32}/>,
      textSvg: <OnboardingText3 preserveAspectRatio="xMinYMin meet" width={'100%'}/>,
      text: <Text style={slideShowStyles.textFontNormal}>
        {`Identifying fake news is hard!`}
        {`\n`}

        {`Better makes it easy to find context and other`}
        {`\n`}

        {`opinions, without telling you what to believe.`}
        {`\n`}

        {`Credder.com's independent credibility score`}
        {`\n`}

        {`provides ratings by independent journalists.`}
      </Text>,
    },
    {
      illustrations: FgOnboarding4,
      title: 'Be safe',
      // textSvg: <OnboardingText4 preserveAspectRatio="xMinYMin meet" width={306 - 32}/>,
      textSvg: <OnboardingText4 preserveAspectRatio="xMinYMin meet" width={'100%'}/>,
      text: <Text style={slideShowStyles.textFontNormal}>
        {`Be safe from surveillance and harassment.`}
        {`\n`}

        {`Block haters in 2 clicks & penalize their posts`}
        {`\n`}

        {`across the platform. Like real life communities,`}
        {`\n`}

        {`our algorithm amplifies respect, without`}
        {`\n`}

        {`rejecting free speech.`}
      </Text>,
    },
    {
      isLogin: true,
      illustrations: FgOnboarding1,
      title: 'Be Safe',
      text: <Text style={slideShowStyles.textFontNormal}>
      </Text>,
    }

  ];
  const handleChangeIndex = (swiperData) => {
    // onChangeNewIndex(swiperData, data.length);
    // flatListRef.current.scrollToIndex({ index: swiperData.index })
    setIndex(swiperData.index)
  };

  const onHandleNextSlide = (toIndex) => {
    flatListRef.current.scrollToIndex({ index: toIndex })
    setIndex(toIndex)
  }

  return (
    <SwiperFlatList
      ref={flatListRef}
      index={0}
      data={data}
      scroll
      renderItem={({ item, index }) => <SlideShowItem index={index}
        key={`slideshowitem-${index}`}
        count={data.length}
        handleLogin={handleLogin}
        illustration={item.illustrations}
        isLogin={item.isLogin}
        onNextSlide={onHandleNextSlide}
        text={item.text}
        title={item.title}
        textSvg={item.textSvg} />
      }
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
    color: COLORS.blackgrey,
  },
  textFontNormal: {
    fontFamily: fonts.inter[400],
    fontSize: fontScale < 1 ? RFValue(16, 812) : RFValue(14, 812),
    lineHeight: fontScale < 1 ? RFValue(22) : RFValue(20),
    color: COLORS.blackgrey,
    flex: 1,
    alignSelf: 'flex-start',
    marginRight: 32,
    zIndex: 1000,
  }
})

const styles = StyleSheet.create({
  containerCard: {
    flex: 1,
    backgroundColor: 'gray',
    width: screenWidth,
  },
  image: { flex: 1 },
  dot: {
    width: 8,
    height: 8,
    marginHorizontal: 5,
  },
  dotContainer: {
    marginBottom: 6,
  },
  onboardingItem: (backgroundColor) => {
    return {
      backgroundColor: backgroundColor,
      alignSelf: 'center',
    }
  }
});
