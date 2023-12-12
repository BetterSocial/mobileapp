/* eslint-disable no-use-before-define */
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import dimen from '../../../utils/dimen';
import {SIGNED} from '../../../hooks/core/constant';
import {ScrollContext} from '../../../hooks/screen/useChatScreenHook';
import {calculateTime} from '../../../utils/time';
import {colors} from '../../../utils/colors';
import {fonts, normalizeFontSize} from '../../../utils/fonts';

interface ChatReplyViewProps {
  type: 'SIGNED' | 'ANONYMOUS';
  messageType: string;
  replyData;
}

const ChatReplyView = ({type, messageType, replyData}: ChatReplyViewProps) => {
  const scrollContext = React.useContext(ScrollContext);
  const isReply = messageType === 'reply';
  const isReplyPrompt = messageType === 'reply_prompt';
  if (!isReply && !isReplyPrompt) return null;
  if (!replyData?.message) return null;

  const userData = replyData?.user;

  const handleTap = () => {
    if (replyData?.id) scrollContext?.handleScrollTo(replyData?.id);
  };

  const containerStyle = [
    styles.textContainer,
    type === SIGNED ? styles.containerSigned : styles.containerAnon
  ];

  const textStyle = [styles.text, replyData?.message_type === 'deleted' && styles.deletedText];

  return (
    <TouchableOpacity
      activeOpacity={replyData?.id ? 0.75 : 1}
      onPress={handleTap}
      style={containerStyle}>
      <View style={styles.chatTitleContainer}>
        <Text style={styles.userText}>{userData?.name ?? userData?.username}</Text>
        {isReply && (
          <>
            <View style={styles.dot} />
            <Text style={styles.timeText}>{calculateTime(replyData?.updated_at, true)}</Text>
          </>
        )}
      </View>

      <Text style={textStyle} numberOfLines={isReply ? 1 : undefined}>
        {replyData?.text ?? replyData?.message}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containerSigned: {
    backgroundColor: colors.signed_secondary
  },
  containerAnon: {
    backgroundColor: colors.anon_secondary
  },
  textContainer: {
    flex: 1,
    marginVertical: dimen.normalizeDimen(6),
    paddingVertical: dimen.normalizeDimen(4),
    paddingHorizontal: dimen.normalizeDimen(8),
    borderRadius: 8
  },
  chatTitleContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: dimen.normalizeDimen(4)
  },
  userText: {
    fontFamily: fonts.inter[600],
    fontSize: normalizeFontSize(12),
    lineHeight: 19.36,
    color: colors.white
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    marginHorizontal: dimen.normalizeDimen(5),
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
  deletedText: {
    color: colors.light_silver,
    fontSize: normalizeFontSize(15),
    fontStyle: 'italic'
  }
});

export default React.memo(ChatReplyView);
