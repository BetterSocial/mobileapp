import * as React from 'react';
import {Dimensions, StyleSheet} from 'react-native';
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
    <Onboarding1 width={onboardingWidth} height={onboardingHeight / 375 * 509} style={styles.onboardingItem('#FFDFA0')}/>,
    <Onboarding2 width={onboardingWidth} height={onboardingHeight / 375 * 509} style={styles.onboardingItem('#76DDFD')}/>,
    <Onboarding3 width={onboardingWidth} height={onboardingHeight / 375 * 509} style={styles.onboardingItem('#54E4B9')}/>,
    <Onboarding4 width={onboardingWidth} height={onboardingHeight / 375 * 509} style={styles.onboardingItem('#B7EC9E')}/>,
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
      renderItem={({item}) => <SlideShowItem>{item}</SlideShowItem>}
      onChangeIndex={handleChangeIndex}
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
    }
}
});
