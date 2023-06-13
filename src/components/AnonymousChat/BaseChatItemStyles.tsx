import {StyleSheet} from 'react-native';

import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';

const BaseChatItemStyles = StyleSheet.create({
  chatContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 14,
    backgroundColor: colors.white
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginStart: 24
  },
  postNotificationImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginStart: 24,
    position: 'absolute',
    top: 24,
    right: 0,
    borderWidth: 2,
    borderColor: colors.white
  },
  chatContentContainer: {
    display: 'flex',
    flexDirection: 'column',
    paddingStart: 15,
    paddingEnd: 15,
    paddingBottom: 14,
    flex: 1,
    borderBottomColor: colors.alto,
    borderBottomWidth: 1
  },
  chatContentSection: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  chatContentName: {
    fontFamily: fonts.inter[700],
    fontSize: 14.05,
    lineHeight: 22,
    alignSelf: 'center',
    flex: 1
  },
  chatContentTime: {
    fontFamily: fonts.poppins[400],
    fontSize: 14,
    lineHeight: 22,
    marginLeft: 20,
    alignSelf: 'center'
  },
  chatContentMessage: {
    fontFamily: fonts.inter[400],
    fontSize: 14.05,
    lineHeight: 22,
    alignSelf: 'center',
    flex: 1
  },
  chatContentUnreadCountContainer: {
    alignSelf: 'center',
    backgroundColor: colors.bondi_blue,
    width: 20,
    height: 20,
    borderRadius: 10,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  chatContentUnreadCount: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    lineHeight: 14.52,
    color: colors.white
  },
  chatContentPostNotificationMessage: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    lineHeight: 20,
    color: colors.gray
  },
  chatContentPostNotificationMessageBold: {
    fontFamily: fonts.inter[600],
    fontSize: 12,
    lineHeight: 20,
    color: colors.gray
  },

  descriptionContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 7
  },
  avatarContainer: {},
  avatarNoHeight: {},
  iconContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginEnd: 15
  },
  iconMargin: {},
  textVoteMargin: {
    marginStart: 5
  }
});

export default BaseChatItemStyles;
