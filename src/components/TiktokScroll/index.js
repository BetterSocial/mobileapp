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
  cardContainer: () => ({
    height: 548,
    width: FULL_WIDTH,
    borderBottomWidth: 7,
    borderBottomColor: colors.lightgrey,
    backgroundColor: 'white',
    maxHeight: 548

  }),
  cardMain: () => ({
      height: 548 ,
      width: '100%',
      maxHeight: 548 * 0.8
  }),
});

const TiktokScroll = (props) => {
  const {data, children, onRefresh, refreshing, onEndReach, contentHeight = 548, onScroll, onScrollBeginDrag, onMomentumScrollEnd, searchHeight, showSearchBar, ...otherProps} = props;
  const flatListRef = React.useRef();
  const bottomTabbar = useBottomTabBarHeight()
  const frameHeight = useSafeAreaFrame().height
  const { bottom } = useSafeAreaInsets();

  return (
    <FlatList
      contentContainerStyle={[styles.flatlistContainer, {paddingTop: showSearchBar ? searchHeight : 0}]}
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
    
      onMomentumScrollEnd={onMomentumScrollEnd}
      initialNumToRender={2}
      ref={flatListRef}
      refreshing={refreshing}
      renderItem={({item ,index}) => (
        <View style={[styles.cardContainer(bottomTabbar, index)]}>
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
  searchHeight: PropTypes.number,
  showSearchBar: PropTypes.bool
};

TiktokScroll.defaultProps = {
  data: [],
  onEndReach: () => null,
  onScroll: () => {},
  onScrollBeginDrag: () => {},
  onMomentumScrollEnd: () => {}
};

export default TiktokScroll;
