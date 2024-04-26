import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import dimen from '../../utils/dimen';
import {COLORS} from '../../utils/theme';

const styles = StyleSheet.create({
  container: {
    shadowColor: COLORS.black000,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
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
