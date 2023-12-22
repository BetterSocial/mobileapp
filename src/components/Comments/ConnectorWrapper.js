import * as React from 'react';
import {View, StyleSheet} from 'react-native';

import {COLORS} from '../../utils/theme';

const ConnectorWrapper = ({children, index}) => (
  <View style={styles.wrapper}>
    <View style={styles.connector(index)} />
    {children}
  </View>
);

export const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'row'
  },
  connector: (index) => ({
    marginLeft: -1,
    width: 24,
    height: 14,
    borderLeftWidth: 1,
    borderBottomWidth: 2,
    borderBottomLeftRadius: 21,
    borderLeftColor: index === 0 ? COLORS.gray1 : 'transparent',
    borderBottomColor: index === 0 ? COLORS.gray1 : 'transparent'
  })
});

export default ConnectorWrapper;
