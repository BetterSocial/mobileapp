import React from "react";
import {ChannelPreviewMessage} from 'stream-chat-react-native';

const PreviewMessage = (props) => {
    const {channel} = props
    if(channel.data.channel_type === 2 || channel.data.channel_type === 3) return null
    return (
        <ChannelPreviewMessage {...props} />
    )
}



export default PreviewMessage