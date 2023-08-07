import {StyleSheet} from 'react-native';

import {colors} from '../../utils/colors';

const BaseChatItemStyles = StyleSheet.create({
  chatContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 14,
    paddingLeft: 24,
    backgroundColor: colors.white
  },
  chatContentContainer: {
    display: 'flex',
    flexDirection: 'column',
    paddingStart: 15,
    paddingEnd: 20,
    paddingBottom: 14,
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
