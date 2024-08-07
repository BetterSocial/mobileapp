import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import dimen from '../../utils/dimen';
import {fonts, normalizeFontSize} from '../../utils/fonts';
import Gap from '../Gap';
import {COLORS} from '../../utils/theme';

const BottomSheetMenu = ({refSheet, dataSheet = [], height = 234}) => {
  return (
    <RBSheet
      ref={refSheet}
      closeOnDragDown={true}
      closeOnPressMask={true}
      customStyles={{
        wrapper: {
          backgroundColor: COLORS.black80
        },
        container: styles.rbsheetContainer(height),
        draggableIcon: styles.rbsheetDraggableIcon
      }}>
      {dataSheet.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={item.id === 1 ? styles.rbsheetContent : styles.rbsheetContent2}
          onPress={item.onPress}>
          {item.icon}
          <Gap width={dimen.normalizeDimen(12)} />
          <Text style={[styles.textShare, item.style]}>{item.name}</Text>
        </TouchableOpacity>
      ))}
    </RBSheet>
  );
};

export default BottomSheetMenu;

const styles = StyleSheet.create({
  rbsheetContainer: (height) => ({
    backgroundColor: COLORS.almostBlack,
    borderTopLeftRadius: dimen.normalizeDimen(12),
    borderTopRightRadius: dimen.normalizeDimen(12),
    height: dimen.normalizeDimen(height)
  }),
  rbsheetDraggableIcon: {
    backgroundColor: COLORS.gray210,
    height: dimen.normalizeDimen(4),
    width: dimen.normalizeDimen(60),
    marginTop: dimen.normalizeDimen(16),
    marginBottom: dimen.normalizeDimen(24)
  },
  rbsheetContent: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: dimen.normalizeDimen(14),
    paddingHorizontal: dimen.normalizeDimen(20),
    borderColor: COLORS.gray210
  },
  rbsheetContent2: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingVertical: dimen.normalizeDimen(14),
    paddingHorizontal: dimen.normalizeDimen(20),
    borderColor: COLORS.gray210
  },
  textShare: {
    fontSize: normalizeFontSize(16),
    fontFamily: fonts.inter[400],
    lineHeight: dimen.normalizeDimen(24),
    textAlignVertical: 'center',
    color: COLORS.white
  }
});
