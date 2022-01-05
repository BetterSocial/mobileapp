import * as React from 'react';
import moment from 'moment';
import { ChannelPreviewStatus } from 'stream-chat-react-native-core';
import { StyleSheet, Text, View } from 'react-native';

import IconChatCheckMark from '../../assets/icon/IconChatCheckMark'
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
        if(!showCheckMark) return <></>
        
        // Not sent yet
        if(checkMarkStatus === 0) {
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
            {/* <ChannelPreviewStatus latestMessagePreview={newLatestMessagePreview} /> */}
            { __renderCheckMark() }
            { __renderDate() }
        </View>
    );
}

const styles = StyleSheet.create({
    time: {
        fontSize: 12, marginLeft: 4
    },

    dateContainer: { paddingRight: 12, display:'flex', flexDirection:'row'}
})

export default ChannelStatusIcon