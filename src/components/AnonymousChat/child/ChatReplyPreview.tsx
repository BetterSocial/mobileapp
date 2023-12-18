/* eslint-disable no-use-before-define */
import React from 'react';
import Animated, {SlideInDown, SlideOutDown} from 'react-native-reanimated';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import IconClear from '../../../assets/icon/IconClear';
import dimen from '../../../utils/dimen';
import useMessageHook from '../../../hooks/screen/useMessageHook';
import {fonts, normalizeFontSize} from '../../../utils/fonts';
import {COLORS} from '../../../utils/theme';

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
        <View style={styles.chatTitleContainer}>
          <Text style={styles.userText}>{replyPreview?.username}</Text>
          <View style={styles.dot} />
          <Text style={styles.timeText}>{replyPreview?.time}</Text>
        </View>

        <Text style={styles.text} numberOfLines={1}>
          {`${replyPreview?.message}`}
        </Text>
      </View>

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
    borderRadius: 8
  },
  chatTitleContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  userText: {
    fontFamily: fonts.inter[600],
    fontSize: 12,
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
    fontSize: 10,
    lineHeight: 12.19,
    alignSelf: 'center',
    color: COLORS.white
  },
  text: {
    fontFamily: fonts.inter[400],
    fontSize: normalizeFontSize(16),
    lineHeight: 19.36,
    marginBottom: 4,
    color: COLORS.white
  },
  containerDismiss: {
    marginLeft: 5,
    padding: 5
  }
});

export default React.memo(ChatReplyPreview);
