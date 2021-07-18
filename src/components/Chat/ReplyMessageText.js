import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import MemoIc_read from '../../assets/chats/Ic_read';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import {calculateTime} from '../../utils/time';
import Dot from '../Dot';
import ProfileMessage from './ProfileMessage';

const ReplyMessageText = ({
  image,
  name,
  time,
  message,
  read,
  isMe,
  otherName,
  otherPhoto,
  replyTime,
  messageReply,
  isMyQuote,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.containerChat(isMe)}>
        <QuotedMessage
          messageReply={messageReply}
          otherName={otherName}
          otherPhoto={otherPhoto}
          replyTime={replyTime}
          isMyQuote={isMyQuote}
        />
        <View style={styles.user}>
          <View style={styles.userDetail}>
            <View style={styles.lineLeft} />
            <View style={styles.userMargin}>
              <ProfileMessage image={image} />
              <View style={styles.userPosision}>
                <Text style={styles.name(true)}>{name}</Text>
                <Dot color="#000" />
                <Text style={styles.time(true)}>{calculateTime(time)}</Text>
              </View>
            </View>
          </View>
          <MemoIc_read
            width={14.9}
            height={8.13}
            fill={read ? colors.bondi_blue : colors.gray}
          />
        </View>
        <Text style={[styles.message(true), styles.messageMargin]}>
          {message}
        </Text>
      </View>
    </View>
  );
};

export default ReplyMessageText;

const QuotedMessage = ({
  otherName,
  otherPhoto,
  replyTime,
  messageReply,
  isMyQuote,
}) => {
  return (
    <View style={styles.containerQuoted(isMyQuote)}>
      <View style={styles.quotedProfile}>
        <ProfileMessage image={otherPhoto} />
        <View style={styles.quotedProfileName}>
          <Text style={[styles.name(false), styles.gapReply]}>{otherName}</Text>
          <Dot color={colors.elm} />
          <Text style={styles.time(false)}>{calculateTime(replyTime)}</Text>
        </View>
      </View>
      <View style={styles.quotedMessage}>
        <Text style={styles.message(false)}>{messageReply}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerQuoted: (isMe) => ({
    backgroundColor: isMe ? colors.tradewind : colors.alto,
    paddingTop: 4,
    paddingLeft: 6,
    paddingRight: 27,
    borderRadius: 8,
  }),
  quotedProfile: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  quotedMessage: {
    borderLeftWidth: 1,
    borderLeftColor: colors.gray,
    marginLeft: 12,
    paddingLeft: 28,
    paddingBottom: 6,
    paddingTop: -3,
  },
  gapReply: {
    marginLeft: 18,
  },
  name: (isMe) => ({
    fontSize: 12,
    fontFamily: fonts.inter[600],
    lineHeight: 14.53,
    color: isMe ? '#000' : colors.elm,
    marginRight: 5.7,
  }),
  time: (isMe) => ({
    fontSize: 10,
    fontFamily: fonts.inter[600],
    lineHeight: 12,
    color: isMe ? '#000' : colors.elm,
    marginLeft: 5,
  }),
  quotedProfileName: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  message: (isMe) => ({
    color: isMe ? '#000' : colors.elm,
    marginTop: 4,
    fontSize: 16,
    fontFamily: fonts.inter[400],
    lineHeight: 19.36,
  }),
  container: {
    flexDirection: 'row',
    flex: 1,
    marginLeft: 10,
    marginRight: 20,
  },
  containerChat: (isMe) => ({
    backgroundColor: isMe ? colors.halfBaked : colors.lightgrey,
    paddingTop: 4,
    paddingBottom: 8,
    paddingLeft: 4,
    paddingRight: 4,
    flex: 1,
    borderRadius: 8,
    marginVertical: 4,
    marginLeft: 8,
  }),
  user: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 18,
  },
  lineLeft: {
    borderLeftWidth: 1,
    borderLeftColor: colors.gray,
    borderBottomColor: colors.gray,
    borderBottomWidth: 1,
    borderBottomLeftRadius: 8,
    width: 10,
    height: 24,
    marginTop: -1,
  },
  userDetail: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  userPosision: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  userMargin: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
  },
  messageMargin: {marginLeft: 70, marginTop: -4},
});
