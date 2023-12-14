/* eslint-disable no-use-before-define */
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import dimen from '../../../utils/dimen';
import {SIGNED} from '../../../hooks/core/constant';
import {calculateTime} from '../../../utils/time';
import {fonts, normalizeFontSize} from '../../../utils/fonts';
import {COLORS} from '../../../utils/theme';

interface ChatReplyViewProps {
  type: 'SIGNED' | 'ANONYMOUS';
  messageType: string;
  replyData;
}

const ChatReplyView = ({type, messageType, replyData}: ChatReplyViewProps) => {
  const isReply = messageType === 'reply';
  const isReplyPrompt = messageType === 'reply_prompt';
  if (!isReply && !isReplyPrompt) return null;
  if (!replyData?.message) return null;

  const userData = replyData?.user;

  const containerStyle = [
    styles.textContainer,
    type === SIGNED ? styles.containerSigned : styles.containerAnon
  ];

  const textStyle = [styles.text, replyData?.message_type === 'deleted' && styles.deletedText];

  return (
    <View style={containerStyle}>
      <View style={styles.chatTitleContainer}>
        <Text style={styles.userText}>{userData?.name ?? userData?.username}</Text>
        {isReply && (
          <>
            <View style={styles.dot} />
            <Text style={styles.timeText}>{calculateTime(replyData?.updated_at, true)}</Text>
          </>
        )}
      </View>

      <Text style={textStyle}>{replyData?.message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  containerSigned: {
    backgroundColor: COLORS.blueSecondary
  },
  containerAnon: {
    backgroundColor: COLORS.holyToscaSecondary
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
    color: COLORS.white
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    marginHorizontal: dimen.normalizeDimen(5),
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
  deletedText: {
    color: COLORS.lightSilver,
    fontSize: normalizeFontSize(15),
    fontStyle: 'italic'
  }
});

export default React.memo(ChatReplyView);
