import * as React from 'react';
import PropTypes from 'prop-types';
import {FlatList, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  flatlistContainer: {
    paddingBottom: 0
  }
});

class ProfileTiktokScroll extends React.Component {
  constructor(props) {
    super(props);
    this.flatListScrollRef = React.createRef();

    this.scrollToTop = this.scrollToTop.bind(this);
  }

  scrollToTop() {
    this.flatListScrollRef.current.scrollToOffset({
      offset: 0,
      animated: true
    });
  }

  // __onViewableItemsChanged({ viewableItems, changed }) {
  //   console.log("Visible items are", viewableItems);
  //   console.log("Changed in this iteration", changed);
  // }

  render() {
    const {
      data,
      children,
      onRefresh,
      refreshing,
      onEndReach,
      onScroll,
      ListHeaderComponent,
      onMomentumScrollEnd
    } = this.props;
    return (
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        initialNumToRender={2}
        contentContainerStyle={styles.flatlistContainer}
        data={data}
        decelerationRate="fast"
        disableIntervalMomentum={true}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeaderComponent}
        onEndReached={onEndReach}
        onRefresh={onRefresh}
        onScroll={onScroll}
        ref={this.flatListScrollRef}
        refreshing={refreshing}
        renderItem={children}
        scrollEventThrottle={1}
        showsVerticalScrollIndicator={false}
        snapToAlignment="end"
        maxToRenderPerBatch={2}
        onEndReachedThreshold={0.5}
        updateCellsBatchingPeriod={10}
        onMomentumScrollEnd={onMomentumScrollEnd}
        removeClippedSubviews
        windowSize={10}
        viewabilityConfig={{
          waitForInteraction: false,
          minimumViewTime: 100,
          itemVisiblePercentThreshold: 80
        }}
        // onViewableItemsChanged={this.__onViewableItemsChanged}
        {...this.props}
      />
    );
  }
}

ProfileTiktokScroll.propTypes = {
  children: PropTypes.node.isRequired,
  data: PropTypes.array.isRequired,
  ListHeaderComponent: PropTypes.element,
  onEndReach: PropTypes.func,
  onRefresh: PropTypes.func,
  onScroll: PropTypes.func,
  onScrollBeginDrag: PropTypes.func,
  refreshing: PropTypes.bool,
  snapToOffsets: PropTypes.arrayOf(PropTypes.number),
  stickyHeaderIndices: PropTypes.arrayOf(PropTypes.number),
  StickyHeaderComponent: PropTypes.element,
  onMomentumScrollEnd: PropTypes.func
};

ProfileTiktokScroll.defaultProps = {
  data: [],
  ListHeaderComponent: null,
  onEndReach: () => null,
  onScroll: () => {},
  StickyHeaderComponent: null,
  stickyHeaderIndices: undefined
};

export default React.memo(ProfileTiktokScroll);
