/* eslint-disable no-use-before-define */
import React from 'react';
import Animated, {SlideInDown, SlideOutDown} from 'react-native-reanimated';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import FastImage from 'react-native-fast-image';
import IconClear from '../../../assets/icon/IconClear';
import dimen from '../../../utils/dimen';
import useMessageHook from '../../../hooks/screen/useMessageHook';
import {colors} from '../../../utils/colors';
import {fonts, normalizeFontSize} from '../../../utils/fonts';
import IconVideoPlay from '../../../assets/icon/IconVideoPlay';

interface ChatReplyPreviewProps {
  type: 'SIGNED' | 'ANONYMOUS';
}

const ChatReplyPreview = ({type}: ChatReplyPreviewProps) => {
  const {replyPreview, clearReplyPreview} = useMessageHook();

  const textContainerStyle = [
    type === 'SIGNED' ? styles.containerSigned : styles.containerAnon,
    styles.textContainer
  ];

  return (
    <Animated.View
      entering={SlideInDown.duration(150)}
      exiting={SlideOutDown.duration(80)}
      style={styles.container}>
      <View style={textContainerStyle}>
        <View>
          <View style={styles.chatTitleContainer}>
            <Text style={styles.userText}>{replyPreview?.username}</Text>
            <View style={styles.dot} />
            <Text style={styles.timeText}>{replyPreview?.time}</Text>
          </View>

          <Text
            style={[styles.text, replyPreview?.attachments.length > 0 ? {fontStyle: 'italic'} : {}]}
            numberOfLines={1}>
            {replyPreview?.attachments.length > 0 ? 'Photo' : `${replyPreview?.message}`}
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
      </View>

      <TouchableOpacity
        onPress={clearReplyPreview}
        activeOpacity={0.75}
        style={styles.containerDismiss}>
        <IconClear fill={colors.black} width={12} height={12} />
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
    backgroundColor: colors.lightgrey
  },
  containerSigned: {
    backgroundColor: colors.darkBlue
  },
  containerAnon: {
    backgroundColor: colors.anon_primary
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
    fontSize: 12,
    lineHeight: 19.36,
    color: colors.white
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: colors.white,
    alignSelf: 'center'
  },
  timeText: {
    fontFamily: fonts.inter[200],
    fontSize: 10,
    lineHeight: 12.19,
    alignSelf: 'center',
    color: colors.white
  },
  text: {
    fontFamily: fonts.inter[400],
    fontSize: normalizeFontSize(16),
    lineHeight: 19.36,
    marginBottom: 4,
    color: colors.white
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
  }
});

export default React.memo(ChatReplyPreview);
