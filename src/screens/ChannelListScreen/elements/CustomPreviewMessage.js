import React from 'react';
import {ChannelPreviewMessage} from 'stream-chat-react-native';
import {StyleSheet, Text} from 'react-native';
import {Context} from '../../../context';

const styles = StyleSheet.create({
  message: {
    flexShrink: 1,
    fontSize: 12
  }
});

const PreviewMessage = (props) => {
  const [profileContext] = React.useContext(Context).profile;
  const {channel} = props;
  if (channel?.data?.channel_type === 2 || channel?.data?.channel_type === 3)
    return (
      <Text numberOfLines={1} style={[styles.message, {color: '#7A7A7A'}]}>
        <Text style={[{color: '#7A7A7A'}]}>
          {props.latestMessagePreview.messageObject &&
            props.latestMessagePreview.messageObject.text}
        </Text>
      </Text>
    );
  if (
    channel?.data?.type === 'group' &&
    props.latestMessagePreview?.messageObject?.isRemoveMember
  ) {
    return (
      <Text numberOfLines={1} style={[styles.message, {color: '#7A7A7A'}]}>
        {props.latestMessagePreview?.messageObject?.text}
      </Text>
    );
  }
  if (props.latestMessagePreview.messageObject) {
    if (props.latestMessagePreview.messageObject.is_from_prepopulated) {
      if (
        props.latestMessagePreview.messageObject.system_user === profileContext.myProfile.user_id
      ) {
        return (
          <Text numberOfLines={1} style={[styles.message, {color: '#7A7A7A'}]}>
            <Text style={[{color: '#7A7A7A'}]}>
              {props.latestMessagePreview.messageObject.other_text}
            </Text>
          </Text>
        );
      }
      return (
        <Text numberOfLines={1} style={[styles.message, {color: '#7A7A7A'}]}>
          <Text style={[{color: '#7A7A7A'}]}>{props.latestMessagePreview.messageObject.text}</Text>
        </Text>
      );
    }
  }
  return <ChannelPreviewMessage {...props} />;
};

export default React.memo(PreviewMessage);
