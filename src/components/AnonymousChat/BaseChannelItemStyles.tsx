import {StyleSheet} from 'react-native';

import dimen from '../../utils/dimen';
import {colors} from '../../utils/colors';

const BaseChatItemStyles = StyleSheet.create({
  chatContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: dimen.normalizeDimen(20),
    backgroundColor: colors.white
  },
  chatContentContainer: {
    flex: 1,
    paddingTop: dimen.normalizeDimen(14),
    paddingBottom: dimen.normalizeDimen(14),
    paddingStart: dimen.normalizeDimen(15),
    paddingEnd: dimen.normalizeDimen(20),
    borderBottomColor: colors.alto,
    borderBottomWidth: 1
  },
  chatContentSection: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  }
});

export default BaseChatItemStyles;
