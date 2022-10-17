import React from "react";
import {ChannelPreviewMessage} from 'stream-chat-react-native';
import { StyleSheet, Text, View } from "react-native";

const styles = StyleSheet.create({
    message: {
        flexShrink: 1,
        fontSize: 12,
      },
})

const PreviewMessage = (props) => {
    const {channel} = props
    if(channel?.data?.channel_type === 2 || channel?.data?.channel_type === 3) return (
        <Text numberOfLines={1} style={[styles.message, { color: '#7A7A7A' }]}>
         <Text
              style={[{ color: '#7A7A7A' }]}
            >
             {props.latestMessagePreview.messageObject && props.latestMessagePreview.messageObject.text}
            </Text>
      </Text>
    )
    return (
        <ChannelPreviewMessage {...props} />
    )
}



export default React.memo (PreviewMessage)
