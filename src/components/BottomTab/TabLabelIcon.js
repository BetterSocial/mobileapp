import * as React from 'react';
import {StyleSheet, View} from 'react-native';

import MemoFeed from '../../assets/icon/Feed';
import MemoHome from '../../assets/icon/Home';
import MemoNews from '../../assets/icon/News';
import MemoProfileIcon from '../../assets/icon/Profile';

function renderTabLabelIcon(type) {
  // eslint-disable-next-line react/display-name
  return ({color}) => {
    if (type === 'Feed') {
      return (
        <View style={styles.center}>
          <MemoFeed fill={color} />
        </View>
      );
    }
    if (type === 'ChannelList') {
      return (
        <View style={styles.center}>
          <MemoHome fill={color} />
        </View>
      );
    }
    if (type === 'News') {
      return (
        <View>
          <MemoNews fill={color} />
        </View>
      );
    }

    return (
      <View>
        <MemoProfileIcon fill={color} />
      </View>
    );
  };
}

export default renderTabLabelIcon;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%'
  },
  badge: {
    height: 7,
    width: 7,
    position: 'absolute',
    bottom: 3,
    borderRadius: 3.5
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});
