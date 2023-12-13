import {StyleSheet} from 'react-native';

import dimen from '../../../utils/dimen';
import {ANONYMOUS, SIGNED} from '../../../hooks/core/constant';
import {MESSAGE_TYPE_DELETED} from '../../../utils/constants';
import {colors} from '../../../utils/colors';
import {fonts, normalizeFontSize} from '../../../utils/fonts';

const AVATAR_SIZE = 24;
const CONTAINER_LEFT_PADDING = 60;
const CONTAINER_RIGHT_PADDING = 10;
const AVATAR_LEFT_MARGIN = 4;
const BUBBLE_LEFT_PADDING = 4;
const BUBBLE_RIGHT_PADDING = 4;

export const targetLastLine =
  CONTAINER_LEFT_PADDING -
  CONTAINER_RIGHT_PADDING -
  AVATAR_SIZE -
  AVATAR_LEFT_MARGIN -
  BUBBLE_LEFT_PADDING -
  BUBBLE_RIGHT_PADDING;

export const styles = StyleSheet.create({
  chatContainer: {
    display: 'flex',
    marginVertical: dimen.normalizeDimen(3)
  },
  chatContainerMyText: {
    paddingLeft: CONTAINER_LEFT_PADDING,
    paddingRight: CONTAINER_RIGHT_PADDING
  },
  chatContainerTargetText: {
    paddingLeft: CONTAINER_RIGHT_PADDING,
    paddingRight: CONTAINER_LEFT_PADDING
  },
  chatContainerPromptMyText: {
    paddingLeft: dimen.normalizeDimen(26)
  },
  chatContainerPromptTargetText: {
    paddingRight: dimen.normalizeDimen(26)
  },
  wrapper: {
    flexDirection: 'row'
  },
  chatTitleContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: dimen.normalizeDimen(6),
    paddingVertical: dimen.normalizeDimen(4),
    backgroundColor: colors.lightgrey,
    borderRadius: 8
  },
  textContainerSigned: {
    backgroundColor: colors.darkBlue
  },
  textContainerAnon: {
    backgroundColor: colors.anon_primary
  },
  textContainerMyText: {
    borderTopEndRadius: 0
  },
  textContainerTargetText: {
    borderTopStartRadius: 0
  },
  textContainerNewLine: {
    paddingBottom: 14
  },
  userText: {
    fontFamily: fonts.inter[600],
    fontSize: normalizeFontSize(12),
    lineHeight: 19.36
  },
  text: {
    fontFamily: fonts.inter[400],
    fontSize: normalizeFontSize(16),
    lineHeight: 19.36,
    marginBottom: 4
  },
  deletedMyText: {
    color: colors.light_silver,
    fontSize: normalizeFontSize(15),
    fontStyle: 'italic'
  },
  deletedTargetText: {
    color: colors.blackgrey,
    fontSize: normalizeFontSize(15),
    fontStyle: 'italic'
  },
  avatar: {
    width: dimen.normalizeDimen(24),
    height: dimen.normalizeDimen(24),
    borderRadius: 15,
    marginLeft: dimen.normalizeDimen(AVATAR_LEFT_MARGIN)
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    marginHorizontal: dimen.normalizeDimen(5),
    alignSelf: 'center'
  },
  dotMyText: {
    backgroundColor: colors.white
  },
  dotTargetText: {
    backgroundColor: colors.black
  },
  timeText: {
    fontFamily: fonts.inter[200],
    fontSize: normalizeFontSize(10),
    lineHeight: 12.19,
    alignSelf: 'center'
  },
  icon: {
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: 6,
    right: 8
  },
  iconNewLine: {
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: 6,
    right: 8
  },
  containerReply: {
    marginLeft: dimen.normalizeDimen(16),
    alignSelf: 'center'
  },
  containerReplyIcon: {
    width: dimen.normalizeDimen(30),
    height: dimen.normalizeDimen(30),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: colors.lightgrey
  },
  mlBuble: {
    marginLeft: dimen.normalizeDimen(BUBBLE_LEFT_PADDING)
  },
  mrBuble: {
    marginRight: dimen.normalizeDimen(BUBBLE_RIGHT_PADDING)
  },
  radius8: {
    borderRadius: 8
  }
});

export const containerStyle = (isMyText: boolean, isReplyPrompt: boolean) => [
  styles.chatContainer,
  isMyText ? styles.chatContainerMyText : styles.chatContainerTargetText,
  isReplyPrompt && isMyText && styles.chatContainerPromptMyText,
  isReplyPrompt && !isMyText && styles.chatContainerPromptTargetText
];

export const textContainerStyle = (
  isMyText: boolean,
  type?: 'ANONYMOUS' | 'SIGNED',
  isNewLine?: boolean
) => [
  styles.textContainer,
  type === SIGNED && styles.textContainerSigned,
  type === ANONYMOUS && styles.textContainerAnon,
  isMyText ? styles.textContainerMyText : styles.textContainerTargetText,
  isNewLine && styles.textContainerNewLine
];

export const dotStyle = (isMyText: boolean) => [
  styles.dot,
  isMyText ? styles.dotMyText : styles.dotTargetText
];

export const textStyle = (isMyText: boolean) => [
  isMyText ? {color: colors.white} : {color: colors.black}
];

export const messageStyle = (isMyText: boolean, messageType?: string) => [
  styles.text,
  isMyText ? {color: colors.white} : {color: colors.black},
  isMyText && messageType === MESSAGE_TYPE_DELETED && styles.deletedMyText,
  !isMyText && messageType === MESSAGE_TYPE_DELETED && styles.deletedTargetText
];
