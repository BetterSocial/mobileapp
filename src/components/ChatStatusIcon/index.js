import * as React from 'react';
import moment from 'moment';
import { ChannelPreviewStatus, useMessageContext } from 'stream-chat-react-native-core';
import { StyleSheet, Text, View } from 'react-native';

import IconChatCheckMark from '../../assets/icon/IconChatCheckMark'
import IconChatClock from '../../assets/icon/IconChatClock';
import { calculateTime } from '../../utils/time';
import { getUserId } from '../../utils/users';

const ChatStatusIcon = (props) => {
    const { message } = useMessageContext()
    let [userId, setUserId] = React.useState("")
    console.log(message)

    React.useEffect(() => {
        __getUserId()
    }, [])
    
    let __getUserId = async() => {
        let id = await getUserId()
        setUserId(id)
    }

    let __renderCheckMark = () => {
        let { status } = message
        let showStatus = message?.groupStyles?.includes("bottom")
        let isMe = message?.user?.id === userId

        if(!showStatus || !isMe) return <></>
        // Not sent yet
        if(status === 'sending' || status === 'failed') {
            // TODO: Change to clock icon
            return <IconChatClock height={14} width={14} />
        } else {
            return <IconChatCheckMark height={14} width={14}/>
        }
    }

    let __renderDate = () => {
        let updatedAt = message?.created_at
        let showStatus = message?.groupStyles?.includes("bottom")
        let isMe = message?.user?.id === userId
        
        if(!showStatus || !isMe) return <></>
        if(!updatedAt) return <></>

        let diffTime = moment(updatedAt).format('hh:mm A')
        return <Text style={styles.time}>{diffTime}</Text>
    }
    
    return (
        <View style={styles.dateContainer}>
            { __renderCheckMark() }
            { __renderDate() }
        </View>
    );
}

const styles = StyleSheet.create({
    time: {
        fontSize: 12, marginLeft: 4
    },

    dateContainer: { paddingRight: 4, display:'flex', flexDirection:'row', marginTop: 2,}
})

export default ChatStatusIcon