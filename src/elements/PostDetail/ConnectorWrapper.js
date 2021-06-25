import * as React from 'react';
import {View, StyleSheet} from 'react-native';

import {colors} from '../../utils/colors';

let ConnectorWrapper = ({children, index}) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.connector(index)} />
      {children}
    </View>
  );
};

let styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    // backgroundColor: 'red',
  },
  connector: (index) => {
    return {
      marginLeft: -1,
      width: 24,
      height: 14,
      borderLeftWidth: 1,
      borderBottomWidth: 1,
      borderBottomLeftRadius: 21,
      borderLeftColor: index === 0 ? colors.gray1 : 'transparent',
      borderBottomColor: index === 0 ? colors.gray1 : 'transparent',
      // marginRight: 4,
    };
  },
});

export default ConnectorWrapper;
