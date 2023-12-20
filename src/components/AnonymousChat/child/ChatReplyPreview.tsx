/* eslint-disable no-use-before-define */
import React from 'react';
import Animated, {SlideInDown, SlideOutDown} from 'react-native-reanimated';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import FastImage from 'react-native-fast-image';
import IconClear from '../../../assets/icon/IconClear';
import dimen from '../../../utils/dimen';
import useMessageHook from '../../../hooks/screen/useMessageHook';
import {MESSAGE_TYPE_DELETED} from '../../../utils/constants';
import {SIGNED} from '../../../hooks/core/constant';
import {ScrollContext} from '../../../hooks/screen/useChatScreenHook';
import {calculateTime} from '../../../utils/time';
import {fonts, normalizeFontSize} from '../../../utils/fonts';
import IconVideoPlay from '../../../assets/icon/IconVideoPlay';
import {COLORS} from '../../../utils/theme';

interface ChatReplyPreviewProps {
  type: 'SIGNED' | 'ANONYMOUS';
}

const ChatReplyPreview = ({type}: ChatReplyPreviewProps) => {
  const scrollContext = React.useContext(ScrollContext);
  const {replyPreview, clearReplyPreview} = useMessageHook();
  const isDeleted = replyPreview?.message_type === MESSAGE_TYPE_DELETED;

  const handleTap = () => {
    if (replyPreview?.id) scrollContext?.handleScrollTo(replyPreview?.id);
  };

  const textContainerStyle = [
    type === SIGNED ? styles.containerSigned : styles.containerAnon,
    styles.textContainer
  ];

  const messageStyle = [styles.text, isDeleted && styles.deletedText];

  return (
    <Animated.View
      entering={SlideInDown.duration(150)}
      exiting={SlideOutDown.duration(80)}
      style={styles.container}>
      <TouchableOpacity
        activeOpacity={replyPreview?.id ? 0.75 : 1}
        onPress={handleTap}
        style={textContainerStyle}>
        <View>
          <View style={styles.chatTitleContainer}>
            <Text style={styles.userText}>{replyPreview?.user?.username}</Text>
            <View style={styles.dot} />
            <Text style={styles.timeText}>{calculateTime(replyPreview?.updated_at, true)}</Text>
          </View>

          <Text style={messageStyle} numberOfLines={1}>
            {replyPreview?.attachments.length > 0 ? 'Photo' : `${replyPreview?.message ?? ''}`}
          </Text>
        </View>
        {replyPreview?.attachments.length > 0 && (
          <View style={styles.mediaContainer}>
            <FastImage
              source={{uri: replyPreview?.attachments[0]?.asset_url}}
              style={styles.mediaImage}
              resizeMode="cover"
            />
            {replyPreview?.attachments[0].video_path && (
              <View style={styles.mediaOverlay}>
                <IconVideoPlay width={24} height={24} />
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={clearReplyPreview}
        activeOpacity={0.75}
        style={styles.containerDismiss}>
        <IconClear fill={COLORS.black} width={12} height={12} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: dimen.normalizeDimen(8),
    paddingLeft: dimen.normalizeDimen(8),
    paddingRight: dimen.normalizeDimen(5),
    alignItems: 'center',
    backgroundColor: COLORS.lightgrey
  },
  containerSigned: {
    backgroundColor: COLORS.blue
  },
  containerAnon: {
    backgroundColor: COLORS.holyTosca
  },
  textContainer: {
    flex: 1,
    paddingVertical: dimen.normalizeDimen(4),
    paddingHorizontal: dimen.normalizeDimen(8),
    borderRadius: 8,
    overflow: 'hidden'
  },
  chatTitleContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  userText: {
    fontFamily: fonts.inter[600],
    fontSize: normalizeFontSize(10),
    lineHeight: 19.36,
    color: COLORS.white
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: COLORS.white,
    alignSelf: 'center'
  },
  timeText: {
    fontFamily: fonts.inter[200],
    fontSize: normalizeFontSize(10),
    lineHeight: 12.19,
    alignSelf: 'center',
    color: COLORS.white
  },
  text: {
    fontFamily: fonts.inter[400],
    fontSize: normalizeFontSize(14),
    lineHeight: 19.36,
    marginBottom: 4,
    color: COLORS.white
  },
  containerDismiss: {
    marginLeft: 5,
    padding: 5
  },
  mediaContainer: {
    width: 44,
    height: 44,
    position: 'absolute',
    right: 0,
    top: 0
  },
  mediaImage: {
    width: '100%',
    height: '100%'
  },
  mediaOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  deletedText: {
    color: COLORS.lightSilver,
    fontStyle: 'italic'
  }
});

export default React.memo(ChatReplyPreview);
