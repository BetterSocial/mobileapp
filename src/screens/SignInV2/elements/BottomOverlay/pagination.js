import * as React from 'react';
import {StyleSheet, View} from 'react-native';

import {COLORS} from '../../../../utils/theme';

const BottomOverlayPagination = ({count, active}) => {
  return (
    <View style={styles.container}>
      {Array(count)
        .fill(0)
        .map((item, index) => {
          return (
            <View
              key={`pagination-${index}`}
              style={styles.paginationItem(active === index)}></View>
          );
        })}
    </View>
  );
};

export default BottomOverlayPagination;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row'
  },
  paginationItem: (isActive) => {
    return {
      width: 12.63,
      height: 4,
      backgroundColor: isActive ? COLORS.signed_primary : COLORS.gray210,
      marginRight: 3,
      borderRadius: 56
    };
  }
});
