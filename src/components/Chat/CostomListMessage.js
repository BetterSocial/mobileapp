import * as React from 'react';
import {View} from 'react-native';
import MessageText from './MessageText';
import MessageWithEmage from './MessageWithEmage';
import MessageWithLink from './MessageWithLink';
import ReplyMessageText from './ReplyMessageText';

const CostomListMessage = (props) => {
  if (props.message.deleted_at) {
    return null;
  }
  if (
    props.message.attachments.length === 0 &&
    props.message.quoted_message === undefined
  ) {
    return (
      <MessageText
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
    props.message.attachments[0].mime_type !== undefined &&
    props.message.attachments[0].mime_type.includes('image')
  ) {
    return (
      <MessageWithEmage
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
      <MessageText />
    </View>
    // <MessageSimple
    //   {...props}

    //   forceAlign="left"
    // alignment="left"
    // ReactionList={null}
    // hasReactions={false}
    // onLongPress={() => {}}
    // textBeforeAttachments
    // />
  );
};

export default CostomListMessage;
