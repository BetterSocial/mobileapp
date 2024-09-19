import {StyleSheet} from 'react-native';

import dimen from '../../utils/dimen';
import {COLORS} from '../../utils/theme';

const BaseChatItemStyles = StyleSheet.create({
  chatContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: dimen.normalizeDimen(20),
    backgroundColor: COLORS.almostBlack
  },
  chatContentContainer: {
    flex: 1,
    paddingTop: dimen.normalizeDimen(14),
    paddingBottom: dimen.normalizeDimen(14),
    paddingStart: dimen.normalizeDimen(15),
    paddingEnd: dimen.normalizeDimen(20),
    borderBottomColor: COLORS.gray210,
    borderBottomWidth: 1
  },
  chatContentSection: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  signedChatChannelContainer: {
    backgroundColor: COLORS.signed_secondary
  },
  signedPostNotificationChannelContainer: {
    backgroundColor: COLORS.gray210
  }
});

export default BaseChatItemStyles;
