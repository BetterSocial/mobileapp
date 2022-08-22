import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { colors } from '../../../utils/colors'


const styles = StyleSheet.create({
    unreadContainer: {
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.bondi_blue,
        marginRight: 12
    },
    unreadText: {
        color: colors.white,
        textAlign:'center',
        fontSize: 10,
        fontFamily:'Inter'
    }
})


const CustomPreviewUnreadCount = (props) => {
    let {readComment} = props
    const handleBadgeMessage = () => {
        if(props.channel.data.channel_type === 2) {
            return null
        }
        if(props.channel.data.channel_type === 3) {
            return (
                <>
                {props.channel.data.unread && props.channel.data.unread > 0 ? <View style={styles.unreadContainer} >
                <Text style={styles.unreadText} >{props.channel.data.unread}</Text>
            </View> : null}
                </>
            )
        }
        return (
             <>
            {props.unread > 0 ? <View style={styles.unreadContainer} >
                <Text style={styles.unreadText} >{props.unread}</Text>
            </View> : null}
            </>
        )
    }

    if(props.channel.type === 'messaging') {
            return (
            <>
            {handleBadgeMessage()}
            </>
        )
    }
    if(readComment !== props.channel.totalComment) {
        if(!readComment || readComment > props.channel.totalComment) {
            readComment = 0
        }
        const calculated = props.channel.totalComment - readComment
        return (
        <>
        {calculated > 0 ? <View style={[styles.unreadContainer, {marginLeft: 'auto', marginRight: 4}]} >
            <Text style={styles.unreadText} >{props.channel.totalComment - readComment}</Text>
        </View> : null}
        
        </>
    )
    }
   return null
}

export default React.memo (CustomPreviewUnreadCount)