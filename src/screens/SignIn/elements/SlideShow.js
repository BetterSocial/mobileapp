import * as React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {SwiperFlatList} from 'react-native-swiper-flatlist';

import Onboarding1 from '../../../assets/images/onboarding1';
import Onboarding2 from '../../../assets/images/onboarding2';
import Onboarding3 from '../../../assets/images/onboarding3';
import Onboarding4 from '../../../assets/images/onboarding4';
import { SlideShowItem } from './SlideShowItem';

const {width: screenWidth} = Dimensions.get('window');

const SlideShow = ({onChangeNewIndex = (newIndex) => {}}) => {

  const onboardingWidth = Dimensions.get('screen').width
  const onboardingHeight = Dimensions.get('screen').height

  const data = [
    {
      illustrations: <Onboarding1 width={onboardingWidth} style={styles.onboardingItem('#FFDFA0')}/>,
      title: 'Real People, Real Opinions, Real Debate',
      text: 'BETTER blocks fake accounts & bots - \nGiving real humans a real voice, and making\nit easy to find context & check your facts.',
      lineHeight: 24
    },
    {
      illustrations: <Onboarding2 width={onboardingWidth} style={styles.onboardingItem('#76DDFD')}/>,
      title: 'Promoting Respect & Free Speech',
      text: `BETTER's algorithms favor moderation, not\npolarization. Block offenders in 2 clicks to reduce\ntheir visibility for everyone - without censorship.`,
      lineHeight: 24,
    },
    {
      illustrations: <Onboarding3 width={onboardingWidth} style={styles.onboardingItem('#54E4B9')}/>,
      title: 'Take Control of Your Data',
      text: 'No personal data, no real name requirement.\nZero-data login, anonymous Votes, Blocks,\nPolls & Follows. Be safe, be yourself!',
      lineHeight: 24,
    },
    {
      illustrations: <Onboarding4 width={onboardingWidth} style={styles.onboardingItem('#B7EC9E')}/>,
      title: 'We will do BETTER',
      text: 'BETTER is a Public Benefits Corporation.\nPrivacy, well-being & free speech are legally\nenshrined in our constitution.\nNow - and in the future.',
      lineHeight: 20
    }
  ];
  const handleChangeIndex = (swiperData) => {
    onChangeNewIndex(swiperData, data.length);
  };

  return (
    <SwiperFlatList
      autoplay
      autoplayDelay={5}
      autoplayLoop={false}
      index={0}
      showPagination
      paginationStyleItem={styles.dot}
      paginationStyle={styles.dotContainer}
      data={data}
      renderItem={({item, index}) => <SlideShowItem index={index} title={item.title} text={item.text} lineHeight={item.lineHeight}>{item.illustrations}</SlideShowItem>}
      onChangeIndex={handleChangeIndex}
      viewabilityConfig={{
        itemVisiblePercentThreshold : 50,
        minimumViewTime: 10
      }}
    />
  );
};

export default SlideShow;

const styles = StyleSheet.create({
  containerCard: {
    flex: 1,
    backgroundColor: 'gray',
    width: screenWidth,
  },
  image: {flex: 1},
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
