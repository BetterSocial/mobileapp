import * as React from 'react';
import PropTypes from 'prop-types';
import {Dimensions, FlatList, StatusBar, StyleSheet, View} from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../../utils/colors';


const FULL_WIDTH = Dimensions.get('screen').width;

const styles = StyleSheet.create({
  flatlistContainer: {
    paddingBottom: 0,
  },
  cardContainer: (bottomTabbar) => ({
    height: (Dimensions.get('screen').height - bottomTabbar - StatusBar.currentHeight) * 0.8 ,
    width: FULL_WIDTH,
    borderBottomWidth: 7,
    borderBottomColor: colors.lightgrey,
    backgroundColor: 'white',
    maxHeight: 548
    // eslint-disable-next-line no-nested-ternary
    // paddingTop: handleCardContainer() ,

  }),
  cardMain: (frameHeight, bottomTabbar, showSearchbar, searchHeight = 0, bottomArea) => ({
    height: (frameHeight - StatusBar.currentHeight - bottomTabbar - searchHeight - bottomArea) * 0.8 ,
      width: '100%',
      maxHeight: 548 * 0.8
  }),
});

const TiktokScroll = (props) => {
  const {data, children, onRefresh, refreshing, onEndReach, contentHeight, onScroll, onScrollBeginDrag, onMomentumScrollEnd, searchHeight, showSearchBar, ...otherProps} = props;
  const flatListRef = React.useRef();
  const bottomTabbar = useBottomTabBarHeight()
  const frameHeight = useSafeAreaFrame().height
  const { bottom } = useSafeAreaInsets();
  console.log(bottomTabbar, 'nukan')
  // const onViewAbleChange = ({ viewableItems, changed }) => {
  //   console.log(viewableItems, 'lakan')
  // }
  return (
    <FlatList
      contentContainerStyle={styles.flatlistContainer}
      data={data}
      decelerationRate="fast"
      disableIntervalMomentum={true}
      keyExtractor={(item) => item.id}
      onEndReached={onEndReach}
      onRefresh={onRefresh}
      onScroll={onScroll}
      onScrollBeginDrag={onScrollBeginDrag}
      getItemLayout={(data, index) => ({
        length: contentHeight, offset: contentHeight * index, index
      })}
      // onViewableItemsChanged={onViewAbleChange}
      // onViewableItemsChanged={__onViewambleItemsChanged}
      onMomentumScrollEnd={onMomentumScrollEnd}
      initialNumToRender={2}
      ref={flatListRef}
      refreshing={refreshing}
      renderItem={({item ,index}) => (
        <View style={[styles.cardContainer(bottomTabbar)]}>
        <View style={styles.cardMain(frameHeight, bottomTabbar, showSearchBar, searchHeight, bottom)}>
          {children({item, index})}
        </View>
      </View>
      )}
      scrollEventThrottle={1}
      showsVerticalScrollIndicator={false}
      snapToAlignment="start"
      snapToInterval={contentHeight}
      maxToRenderPerBatch={2}
      updateCellsBatchingPeriod={10}
      removeClippedSubviews
      windowSize={10}
      {...otherProps}
    />
  );
};

TiktokScroll.propTypes = {
  data: PropTypes.array.isRequired,
  children: PropTypes.node.isRequired,
  onRefresh: PropTypes.func,
  refreshing: PropTypes.bool,
  onMomentumScrollEnd: PropTypes.func,
  onScrollBeginDrag: PropTypes.func,
  onEndReach: PropTypes.func,
  onScroll: PropTypes.func,
  searchHeight: PropTypes.number
};

TiktokScroll.defaultProps = {
  data: [],
  onEndReach: () => null,
  onScroll: () => {},
  onScrollBeginDrag: () => {},
  onMomentumScrollEnd: () => {}
};

export default TiktokScroll;
