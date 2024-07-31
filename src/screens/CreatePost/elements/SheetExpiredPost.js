import * as React from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import {StyleSheet, Text, View} from 'react-native';

import FlatListItem from '../../../components/FlatListItem';
import dimen from '../../../utils/dimen';
import {COLORS} from '../../../utils/theme';
import {fonts, normalizeFontSize} from '../../../utils/fonts';

const SheetExpiredPost = ({refExpired, data, select, onSelect, onClose = () => {}}) => (
  <RBSheet
    ref={refExpired}
    closeOnDragDown={true}
    closeOnPressMask={true}
    onClose={onClose}
    customStyles={{
      wrapper: {
        backgroundColor: COLORS.black80
      },
      container: styles.containerSheet,
      draggableIcon: styles.draggableIcon
    }}>
    <View style={styles.container}>
      <Text style={styles.header}>Post expiration after</Text>
      {data.map((value, index) => (
        <FlatListItem
          key={index}
          value={value.label}
          index={index}
          select={select}
          onSelect={onSelect}
        />
      ))}
    </View>
  </RBSheet>
);

export default SheetExpiredPost;

const styles = StyleSheet.create({
  container: {
    paddingTop: dimen.normalizeDimen(20),
    paddingBottom: dimen.normalizeDimen(38)
  },
  header: {
    color: COLORS.black,
    fontFamily: fonts.inter[600],
    fontSize: normalizeFontSize(18),
    fontWeight: 'bold',
    paddingHorizontal: dimen.normalizeDimen(20)
  },
  containerSheet: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    height: 'auto',
    backgroundColor: COLORS.almostBlack
  },
  draggableIcon: {
    backgroundColor: COLORS.gray110
  }
});
