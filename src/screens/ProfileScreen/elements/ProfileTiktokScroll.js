import * as React from 'react';
import PropTypes from 'prop-types';
import { Dimensions, FlatList, StatusBar, StyleSheet, Text } from 'react-native';

const FULL_HEIGHT = Dimensions.get('screen').height;
const tabBarHeight = StatusBar.currentHeight;

const styles = StyleSheet.create({
  flatlistContainer: {
    paddingBottom: 0,
  },
});

class ProfileTiktokScroll extends React.Component {
  constructor(props) {
    super(props)
    this.flatListScrollRef = React.createRef()

    this.scrollToTop = this.scrollToTop.bind(this)
  }

  scrollToTop() {
    this.flatListScrollRef.current.scrollToOffset({
      offset: 0,
      animated: true
    })
  }

  render() {
    const { data, children, onRefresh, refreshing, 
      onEndReach, onScroll, ListHeaderComponent } = this.props;
    return (
      <FlatList
        { ...this.props}
        ref={this.flatListScrollRef}
        data={data}
        renderItem={children}
        keyExtractor={(item) => {
          return item.id;
        }}
        ListHeaderComponent={ListHeaderComponent}
        showsVerticalScrollIndicator={false}
        snapToAlignment="center"
        contentContainerStyle={styles.flatlistContainer}
        refreshing={refreshing}
        onRefresh={onRefresh}
        scrollEventThrottle={1}
        onEndReached={onEndReach}
        onScroll={onScroll} />
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
};

ProfileTiktokScroll.defaultProps = {
  data: [],
  ListHeaderComponent: null,
  onEndReach: () => null,
  onScroll: () => {},
  StickyHeaderComponent: null,
  stickyHeaderIndices: undefined,
};

export default ProfileTiktokScroll;
