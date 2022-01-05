import * as React from 'react';
import moment from 'moment';
import { ChannelPreviewStatus, useMessageContext } from 'stream-chat-react-native-core';
import { StyleSheet, Text, View } from 'react-native';

import IconChatCheckMark from '../../assets/icon/IconChatCheckMark'
import { calculateTime } from '../../utils/time';
import { getUserId } from '../../utils/users';

const ChatStatusIcon = (props) => {
    const { message } = useMessageContext()
    let [userId, setUserId] = React.useState("")

    React.useEffect(() => {
        __getUserId()
    }, [])
    
    let __getUserId = async() => {
        let id = await getUserId()
        setUserId(id)
    }

    let __renderCheckMark = () => {
        let { status } = message
        
        // Not sent yet
        if(status === 'sending') {
            // TODO: Change to clock icon
            return <Text>p</Text>
        } else {
            return <IconChatCheckMark height={16} width={16}/>
        }
    }

    let __renderDate = () => {
        let updatedAt = props?.latestMessagePreview?.messageObject?.updated_at 
        if(!updatedAt) return <></>

        let diffTime = calculateTime(moment(updatedAt))
        return <Text style={styles.time}>{diffTime}</Text>
    }
    
    return (
        <View style={styles.dateContainer}>
            { __renderCheckMark() }
        </View>
    );
}

const styles = StyleSheet.create({
    time: {
        fontSize: 12, marginLeft: 4
    },

    dateContainer: { paddingRight: 4, display:'flex', flexDirection:'row'}
})

export default ChatStatusIcon