import * as React from 'react';
import PropTypes from 'prop-types';
import {FlatList, RefreshControl, StyleSheet} from 'react-native';
import {COLORS} from '../../utils/theme';

const styles = StyleSheet.create({
  flatlistContainer: {
    paddingBottom: 0
  }
});

class TiktokScroll extends React.Component {
  constructor(props) {
    super(props);
    this.flatListScrollRef = React.createRef();
    this.scrollToTop = this.scrollToTop.bind(this);
  }

  scrollToTop() {
    this.flatListScrollRef?.current?.scrollToOffset?.({
      offset: 0,
      animated: true
    });
  }

  componentDidMount() {
    if (this.props.contentInsetAdjustmentBehavior === 'never') {
      setTimeout(() => {
        this.scrollToTop();
      }, 200);
    }
  }

  render() {
    const {
      data,
      renderItem,
      onRefresh,
      refreshing,
      onEndReach,
      contentHeight = 548,
      contentInsetAdjustmentBehavior = 'automatic',
      onScroll,
      onScrollBeginDrag,
      onMomentumScrollEnd,
      searchHeight,
      showSearchBar,
      ...otherProps
    } = this.props;

    return (
      <FlatList
        contentInsetAdjustmentBehavior={contentInsetAdjustmentBehavior}
        contentContainerStyle={[
          styles.flatlistContainer,
          {paddingTop: showSearchBar ? searchHeight : 0}
        ]}
        data={data}
        decelerationRate="fast"
        disableIntervalMomentum={true}
        keyExtractor={(item) => item.id}
        onEndReached={onEndReach}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.white} />
        }
        onScroll={onScroll}
        onScrollBeginDrag={onScrollBeginDrag}
        getItemLayout={(item, index) => ({
          length: contentHeight,
          offset: contentHeight * index,
          index
        })}
        onMomentumScrollEnd={onMomentumScrollEnd}
        initialNumToRender={2}
        ref={this.flatListScrollRef}
        renderItem={renderItem}
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
  }
}

TiktokScroll.propTypes = {
  data: PropTypes.array,
  renderItem: PropTypes.func,
  onRefresh: PropTypes.func,
  refreshing: PropTypes.bool,
  onMomentumScrollEnd: PropTypes.func,
  onScrollBeginDrag: PropTypes.func,
  onEndReach: PropTypes.func,
  onScroll: PropTypes.func,
  searchHeight: PropTypes.number,
  showSearchBar: PropTypes.bool,
  contentInsetAdjustmentBehavior: PropTypes.string
};

TiktokScroll.defaultProps = {
  data: [],
  onEndReach: () => null,
  onScroll: () => {},
  onScrollBeginDrag: () => {},
  onMomentumScrollEnd: () => {}
};

export default TiktokScroll;
