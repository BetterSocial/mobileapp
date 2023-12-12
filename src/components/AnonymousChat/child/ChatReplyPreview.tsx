/* eslint-disable no-use-before-define */
import React from 'react';
import Animated, {SlideInDown, SlideOutDown} from 'react-native-reanimated';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import IconClear from '../../../assets/icon/IconClear';
import dimen from '../../../utils/dimen';
import useMessageHook from '../../../hooks/screen/useMessageHook';
import {ScrollContext} from '../../../hooks/screen/useChatScreenHook';
import {calculateTime} from '../../../utils/time';
import {colors} from '../../../utils/colors';
import {fonts, normalizeFontSize} from '../../../utils/fonts';

interface ChatReplyPreviewProps {
  type: 'SIGNED' | 'ANONYMOUS';
}

const ChatReplyPreview = ({type}: ChatReplyPreviewProps) => {
  const scrollContext = React.useContext(ScrollContext);
  const {replyPreview, clearReplyPreview} = useMessageHook();
  const isDeleted = replyPreview?.message_type === 'deleted';

  const handleTap = () => {
    if (replyPreview?.id) scrollContext?.handleScrollTo(replyPreview?.id);
  };

  const textContainerStyle = [
    type === 'SIGNED' ? styles.containerSigned : styles.containerAnon,
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
        <View style={styles.chatTitleContainer}>
          <Text style={styles.userText}>{replyPreview?.user?.username}</Text>
          <View style={styles.dot} />
          <Text style={styles.timeText}>{calculateTime(replyPreview?.updated_at, true)}</Text>
        </View>

        <Text style={messageStyle} numberOfLines={1}>
          {replyPreview?.message}
        </Text>
      </TouchableOpacity>

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
    borderRadius: 8
  },
  chatTitleContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  userText: {
    fontFamily: fonts.inter[600],
    fontSize: normalizeFontSize(10),
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
    fontSize: normalizeFontSize(10),
    lineHeight: 12.19,
    alignSelf: 'center',
    color: colors.white
  },
  text: {
    fontFamily: fonts.inter[400],
    fontSize: normalizeFontSize(14),
    lineHeight: 19.36,
    marginBottom: 4,
    color: colors.white
  },
  containerDismiss: {
    marginLeft: 5,
    padding: 5
  },
  deletedText: {
    color: colors.light_silver,
    fontStyle: 'italic'
  }
});

export default React.memo(ChatReplyPreview);
