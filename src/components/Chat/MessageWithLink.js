import * as React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';

import Autolink from 'react-native-autolink';

import MemoIc_read from '../../assets/chats/Ic_read';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import {trimString} from '../../utils/string/TrimString';
import {calculateTime} from '../../utils/time';
import Dot from '../Dot';
import ProfileMessage from './ProfileMessage';

const MessageWithLink = ({
  image,
  name,
  time,
  message,
  read,
  isMe,
  attachments,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.containerImage}>
        <ProfileMessage image={image} />
      </View>
      <View style={styles.containerChat(isMe)}>
        <View style={styles.user}>
          <View style={styles.userDetail}>
            <Text style={styles.name}>{name}</Text>
            <Dot color="#000" />
            <Text style={styles.time}>{calculateTime(time)}</Text>
          </View>
          <MemoIc_read
            width={14.9}
            height={8.13}
            fill={read ? colors.bondi_blue : colors.gray}
          />
        </View>
        <View style={styles.containerPreview(isMe)}>
          <View style={styles.previewText}>
            <Text style={styles.title}>
              {trimString(attachments[0].title, 40)}
            </Text>
            <Text style={styles.authorName(isMe)}>
              {attachments[0].author_name}
            </Text>
          </View>
          <Image
            width={70}
            height={64}
            style={styles.imageLink}
            source={{uri: attachments[0].thumb_url}}
          />
        </View>
        <Autolink text={message} style={styles.message} />
        {/* <Text style={styles.message}>{message}</Text> */}
      </View>
    </View>
  );
};

export default MessageWithLink;

const styles = StyleSheet.create({
  previewText: {
    flex: 1,
  },
  imageLink: {
    width: 70,
    height: 64,
    borderBottomRightRadius: 4,
    borderTopRightRadius: 4,
  },
  title: {
    color: '#000',
    fontFamily: fonts.inter[600],
    fontSize: 14,
    lineHeight: 16.94,
    marginTop: 5,
  },
  authorName: (isMe) => ({
    color: isMe ? '#fff' : colors.gray,
    fontFamily: fonts.inter[400],
    fontSize: 12,
    marginBottom: 5,
    lineHeight: 18,
  }),
  containerPreview: (isMe) => ({
    backgroundColor: isMe ? colors.tradewind : colors.lightgrey,
    marginHorizontal: -4,
    borderRadius: 4,
    paddingLeft: 6,
    flexDirection: 'row',
    flex: 1,
    marginTop: 8,
  }),
  name: {
    fontSize: 12,
    fontFamily: fonts.inter[600],
    lineHeight: 14.53,
    color: '#000',
    marginRight: 5.7,
  },
  containerImage: {
    paddingTop: 5,
  },
  time: {
    fontSize: 10,
    fontFamily: fonts.inter[600],
    lineHeight: 12,
    color: '#000',
    marginLeft: 5,
  },
  message: {
    color: '#000',
    marginTop: 4,
    fontSize: 16,
    fontFamily: fonts.inter[400],
    lineHeight: 19.36,
  },
  container: {
    flexDirection: 'row',
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 4,
  },
  containerChat: (isMe) => ({
    backgroundColor: isMe ? colors.halfBaked : colors.lightgrey,
    paddingVertical: 8,
    paddingLeft: 8,
    paddingRight: 9.35,
    flex: 1,
    borderRadius: 8,
    marginLeft: 8,
  }),
  user: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userDetail: {flexDirection: 'row', alignItems: 'center'},
});
