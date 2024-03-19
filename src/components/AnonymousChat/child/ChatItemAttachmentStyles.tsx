import {StyleSheet} from 'react-native';

import dimen from '../../../utils/dimen';
import {COLORS} from '../../../utils/theme';
import {fonts} from '../../../utils/fonts';

const AVATAR_MARGIN = 4;
const BUBBLE_LEFT_PADDING = 8;
const BUBBLE_RIGHT_PADDING = 8;
const BUBBLE_LEFT_PADDING_ATTACHMENT = 4;
const BUBBLE_RIGHT_PADDING_ATTACHMENT = 4;
const ChatItemAttachmentStyles = StyleSheet.create({
  attachmentContainer: {
    width: '100%',
    height: 268,
    borderRadius: 8,
    overflow: 'hidden',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  moreOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  moreText: {
    fontSize: dimen.normalizeDimen(16),
    fontFamily: fonts.inter[400],
    color: COLORS.white
  },
  attachmentFileContainer: {
    backgroundColor: COLORS.gray,
    justifyContent: 'center',
    height: dimen.normalizeDimen(64),
    flexDirection: 'row',
    alignItems: 'center'
  },
  attachmentFileContent: {
    flex: 1,
    padding: dimen.normalizeDimen(6)
  },
  attachmentFileName: {
    fontSize: dimen.normalizeDimen(14),
    fontFamily: fonts.inter[600],
    color: COLORS.black
  },
  attachmentFileInfo: {
    fontSize: dimen.normalizeDimen(12),
    fontFamily: fonts.inter[400],
    color: COLORS.gray500
  },
  attachmentFileIcon: {
    backgroundColor: COLORS.light_silver,
    width: dimen.normalizeDimen(64),
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export {
  AVATAR_MARGIN,
  BUBBLE_LEFT_PADDING,
  BUBBLE_RIGHT_PADDING,
  BUBBLE_LEFT_PADDING_ATTACHMENT,
  BUBBLE_RIGHT_PADDING_ATTACHMENT,
  ChatItemAttachmentStyles
};
