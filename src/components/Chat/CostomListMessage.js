import * as React from 'react';
import {View} from 'react-native';

import MessageText from './MessageText';
import MessageWithImage from './MessageWithImage';
import MessageWithLink from './MessageWithLink';
import ReplyMessageText from './ReplyMessageText';

const CostomListMessage = (props) => {
  // console.log(JSON.stringify(props));
  if (props.message.deleted_at) {
    return null;
  }
  if (
    props.message.attachments.length === 0 &&
    props.message.quoted_message === undefined
  ) {
    return (
      <MessageText
        key={props.message.id}
        image={props.message.user.image}
        name={props.message.user.name}
        time={props.message.created_at}
        message={props.message.text}
        read={props.message.readBy}
        isMe={props.message.user.streamUserToken === undefined}
      />
    );
  }
  if (
    props.message.attachments.length !== 0 &&
    props.message.quoted_message === undefined &&
    props.message.attachments[0].type === 'image' &&
    props.message.attachments[0].title_link === undefined
  ) {
    return (
      <MessageWithImage
        key={props.message.id}
        attachments={props.message.attachments}
        image={props.message.user.image}
        name={props.message.user.name}
        time={props.message.created_at}
        message={props.message.text}
        read={props.message.readBy}
        isMe={props.message.user.streamUserToken === undefined}
      />
    );
  }
  if (
    props.message.attachments.length === 0 &&
    props.message.quoted_message !== undefined
  ) {
    return (
      <ReplyMessageText
        key={props.message.id}
        image={props.message.user.image}
        name={props.message.user.name}
        time={props.message.created_at}
        message={props.message.text}
        read={props.message.readBy}
        isMe={props.message.user.streamUserToken === undefined}
        messageReply={props.message.quoted_message.text}
        otherName={props.message.quoted_message.user.name}
        otherPhoto={props.message.quoted_message.user.image}
        replyTime={props.message.quoted_message.created_at}
        isMyQuote={
          props.message.quoted_message.user.streamUserToken === undefined
        }
        attachments={props.message.quoted_message.attachments[0]}
      />
    );
  }
  if (
    props.message.attachments.length !== 0 &&
    props.message.quoted_message === undefined &&
    props.message.attachments[0].thumb_url !== undefined
  ) {
    return (
      <MessageWithLink
        key={props.message.id}
        image={props.message.user.image}
        name={props.message.user.name}
        time={props.message.created_at}
        message={props.message.text}
        read={props.message.readBy}
        isMe={props.message.user.streamUserToken === undefined}
        attachments={props.message.attachments}
      />
    );
  }

  return (
    <View>
      <MessageText key={props.message.id} />
    </View>
  );

  // return (
  //   <MessageSimple
  //     {...props}
  //     forceAlign="left"
  //     ReactionList={null}
  //     onLongPress={() => {}}
  //     textBeforeAttachments
  //     ActionSheet={() => <View />}
  //     MessageAvatar={() => <View />}
  //     MessageHeader={() => <View />}
  //     MessageFooter={() => <View />}
  //     MessageText={() => <View />}
  //     UrlPreview={() => <View />}
  //     Giphy={() => <View />}
  //     supportedReactions={false}
  //   />
  // );
};

export default CostomListMessage;
