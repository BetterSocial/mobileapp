import * as React from 'react';
import {TouchableWithoutFeedback} from 'react-native';
import {Image, StyleSheet, Text, View} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import MemoIc_read from '../../assets/chats/Ic_read';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import {trimString} from '../../utils/string/TrimString';
import {calculateTime} from '../../utils/time';
import Dot from '../Dot';
import ActionChat from './ActionChat';
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
  attachments,
}) => {
  const [onAction, setOnAction] = React.useState(false);
  return (
    <ActionChat isMe={isMe} active={onAction}>
      <View style={styles.container}>
        <TouchableWithoutFeedback
          onLongPress={() => setOnAction(true)}
          onPress={() => setOnAction(false)}>
          <View style={styles.containerChat(isMe)}>
            <QuotedMessage
              messageReply={messageReply}
              otherName={otherName}
              otherPhoto={otherPhoto}
              replyTime={replyTime}
              isMyQuote={isMyQuote}
              attachments={attachments}
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
            </View>
            <Text style={[styles.message(true), styles.messageMargin]}>
              {message}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </ActionChat>
  );
};

export default ReplyMessageText;

const QuotedMessage = ({
  otherName,
  otherPhoto,
  replyTime,
  messageReply,
  isMyQuote,
  attachments,
}) => {
  const imgExists = () => {
    return (
      attachments !== undefined &&
      attachments.mime_type !== undefined &&
      attachments.mime_type.includes('image')
    );
  };
  const textMore = () => {
    return imgExists() ? 21 : 27;
  };
  const textIsExists = () => {
    return imgExists() && messageReply === '';
  };

  return (
    <View style={styles.containerQuoted(isMyQuote)}>
      <View style={styles.quotedContent}>
        <View style={styles.quotedProfile}>
          <ProfileMessage image={otherPhoto} />
          <View style={styles.quotedProfileName}>
            <Text style={[styles.name(false), styles.gapReply]}>
              {otherName}
            </Text>
            <Dot color={colors.elm} />
            <Text style={styles.time(false)}>{calculateTime(replyTime)}</Text>
          </View>
        </View>
        <View style={styles.quotedMessage}>
          <Text style={styles.message(false)}>
            {textIsExists() && (
              <>
                <Icon name="photo" color={colors.elm} size={15} /> Photo
              </>
            )}
            {!textIsExists() && trimString(messageReply, textMore())}
          </Text>
        </View>
      </View>
      {imgExists() && (
        <Image
          style={styles.assetImage}
          source={{
            uri: attachments.asset_url,
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  quotedContent: {
    flex: 1,
    paddingTop: 4,
    paddingLeft: 6,
    borderRadius: 8,
  },
  assetImage: {
    width: 48,
    height: 48,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  containerQuoted: (isMe) => ({
    backgroundColor: isMe ? colors.tradewind : colors.alto,
    flexDirection: 'row',
    flex: 1,
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
    marginTop: -9,
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
