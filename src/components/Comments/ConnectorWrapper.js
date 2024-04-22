import * as React from 'react';
import {View, StyleSheet} from 'react-native';

import {COLORS} from '../../utils/theme';

const ConnectorWrapper = ({children, index, level}) => (
  <View style={styles.wrapper}>
    <View style={styles.connector(index, level)} />
    {children}
  </View>
);

export const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'row'
  },
  connector: (index, level) => ({
    marginLeft: level === 2 ? 0 : -1,
    width: 24,
    height: 14,
    borderLeftWidth: 1,
    borderBottomWidth: 2,
    borderBottomLeftRadius: 21,
    borderLeftColor: index === 0 ? COLORS.gray210 : COLORS.transparent,
    borderBottomColor: index === 0 ? COLORS.gray210 : COLORS.transparent
  })
});

export default ConnectorWrapper;
