import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import dimen from '../../utils/dimen';
import { COLORS } from '../../utils/theme';

const styles = StyleSheet.create({
  container: {
    elevation: 3,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 1,
    position: 'absolute',
    bottom: dimen.size.FEED_ACTION_BUTTON_HEIGHT_FROM_BOTTOM,
    right: dimen.size.FEED_ACTION_BUTTON_HEIGHT_FROM_RIGHT,
    zIndex: 1
  }
});

const ShadowFloatingButtons = ({children}) => {
  return <View style={styles.container}>{children}</View>;
};

export default ShadowFloatingButtons;
