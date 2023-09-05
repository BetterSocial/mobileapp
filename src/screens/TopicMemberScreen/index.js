import * as React from 'react';
import {StyleSheet, StatusBar, View, ScrollView} from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  flatlistContainer: {
    paddingBottom: 0
  }
});

const TopicMemberScreen = (props) => {
  return (
    <View>
      <StatusBar translucent={false} />
      <ScrollView>
        <View />
      </ScrollView>
    </View>
  );
};

TopicMemberScreen.propTypes = {
  data: PropTypes.array.isRequired,
  children: PropTypes.node.isRequired,
  onRefresh: PropTypes.func,
  refreshing: PropTypes.bool,
  onScrollBeginDrag: PropTypes.func,
  onEndReach: PropTypes.func
};

TopicMemberScreen.defaultProps = {
  data: [],
  onEndReach: () => null
};

export default TopicMemberScreen;
