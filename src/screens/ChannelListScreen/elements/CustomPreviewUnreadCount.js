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

    if(props.channel.type === 'messaging') {
            return (
            <>
            {props.unread > 0 ? <View style={styles.unreadContainer} >
                <Text style={styles.unreadText} >{props.unread}</Text>
            </View> : null}
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