import * as React from 'react';
import {StyleSheet, View} from 'react-native';

import {colors} from '../utils/colors';

const HomeTabBarLabel = (screenOptionsNavigation) => (
  <View
    style={[
      styles.badge,
      {
        backgroundColor: screenOptionsNavigation.isFocused() ? colors.holytosca : 'transparent'
      }
    ]}
  />
);

export default HomeTabBarLabel;

const styles = StyleSheet.create({
  badge: {
    height: 7,
    width: 7,
    position: 'absolute',
    bottom: 3,
    borderRadius: 3.5
  }
});
