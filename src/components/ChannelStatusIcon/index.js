import * as React from 'react';
import moment from 'moment';
import { ChannelPreviewStatus } from 'stream-chat-react-native-core';
import { StyleSheet, Text, View } from 'react-native';

import IconChatCheckMark from '../../assets/icon/IconChatCheckMark'
import IconChatClock from '../../assets/icon/IconChatClock';
import IconChatDelivered from '../../assets/icon/IconChatDelivered';
import { calculateTime } from '../../utils/time';
import { getUserId } from '../../utils/users';

const ChannelStatusIcon = (props) => {
    let [userId, setUserId] = React.useState("")
    let newLatestMessagePreview = { ...props.latestMessagePreview };
    // console.log(newLatestMessagePreview)

    React.useEffect(() => {
        __getUserId()
    }, [])
    
    let __getUserId = async() => {
        let id = await getUserId()
        setUserId(id)
    }

    let __renderCheckMark = () => {
        let showCheckMark = props?.latestMessagePreview?.messageObject?.id?.indexOf(userId) > -1
        let checkMarkStatus = props?.latestMessagePreview?.status
        let sendMessageStatus = props?.latestMessagePreview?.messageObject?.status

        if(!showCheckMark) return <></>
        
        if(checkMarkStatus === 0 || sendMessageStatus === 'failed') {
            // Not sent yet
            return <IconChatClock height={14} width={14} />
        } else if(checkMarkStatus === 1) {
            // Not read by recipient
            return <IconChatCheckMark height={15} width={11} style={{alignSelf:'center'}}/>
        } else if(checkMarkStatus === 2) {
            // Read by recipient
            return <IconChatDelivered height={15} width={15} style={{alignSelf:'center'}}/>
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
            {/* <ChannelPreviewStatus latestMessagePreview={newLatestMessagePreview} /> */}
            {/* { __renderCheckMark() } */}
            { __renderDate() }
        </View>
    );
}

const styles = StyleSheet.create({
    time: {
        fontSize: 12, marginLeft: 4
    },

    dateContainer: { 
        paddingRight: 12, 
        display:'flex', 
        flexDirection:'row',
        justifyContent: 'center',
        // backgroundColor: 'red'
    }
})

export default ChannelStatusIcon