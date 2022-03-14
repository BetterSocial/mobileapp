import * as React from 'react';
import moment from 'moment';
import { StyleSheet, Text, View } from 'react-native';
import { useMessageContext } from 'stream-chat-react-native-core';

import IconChatCheckMark from '../../assets/icon/IconChatCheckMark'
import IconChatClock from '../../assets/icon/IconChatClock';
import IconChatDelivered from '../../assets/icon/IconChatDelivered';
import { calculateTime } from '../../utils/time';
import { getUserId } from '../../utils/users';

const ChatStatusIcon = (props) => {
    const messageContext = useMessageContext()
    const { message } = messageContext
    let [userId, setUserId] = React.useState("")

    React.useEffect(() => {
        __getUserId()
    }, [])
    
    let __getUserId = async() => {
        let id = await getUserId()
        setUserId(id)
    }

    let __renderCheckMark = () => {
        let { status, readBy } = message
        let showStatus = message?.groupStyles?.length > 0
        let isMe = message?.user?.id === userId

        if(!showStatus || !isMe || status === 'failed') return <></>
        // Not sent yet
        // if(status === 'sending' || status === 'failed') {
        if(status === 'sending') {
            // NOTE: status sending
            return <IconChatClock height={14} width={14} />
        } else if(readBy) {
            // NOTE: status read by recipient
            return <IconChatDelivered height={14} width={14} style={{marginTop: -2}}/>
        } else {
            // NOTE: status has not been read by recipient
            return <IconChatCheckMark height={11} width={11}/>
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
            {/* { __renderCheckMark() } */}
            {/* { __renderDate() } */}
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