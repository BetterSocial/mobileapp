import {StyleSheet} from 'react-native';

import dimen from '../../utils/dimen';
import {colors} from '../../utils/colors';

const BaseChatItemStyles = StyleSheet.create({
  chatContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: dimen.normalizeDimen(14),
    paddingLeft: dimen.normalizeDimen(20),
    backgroundColor: colors.white
  },
  chatContentContainer: {
    display: 'flex',
    flexDirection: 'column',
    paddingStart: dimen.normalizeDimen(15),
    paddingEnd: dimen.normalizeDimen(20),
    paddingBottom: dimen.normalizeDimen(14),
    flex: 1,
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
