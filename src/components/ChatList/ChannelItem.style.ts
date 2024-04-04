import {StyleSheet} from 'react-native';

import dimen from '../../utils/dimen';
import {COLORS} from '../../utils/theme';

export const channelItemStyles = StyleSheet.create({
  channelContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: dimen.normalizeDimen(20),
    backgroundColor: COLORS.almostBlack
  },
  contentContainer: {
    flex: 1,
    paddingTop: dimen.normalizeDimen(14),
    paddingBottom: dimen.normalizeDimen(14),
    paddingStart: dimen.normalizeDimen(15),
    paddingEnd: dimen.normalizeDimen(20),
    borderBottomColor: COLORS.gray200,
    borderBottomWidth: 1
  }
});
