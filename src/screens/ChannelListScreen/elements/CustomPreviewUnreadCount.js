import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { colors } from '../../../utils/colors'


const styles = StyleSheet.create({
    unreadContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.bondi_blue,
        marginRight: 12
    },
    unreadText: {
        color: colors.white,
        textAlign:'center',
        fontSize: 12
    }
})


const CustomPreviewUnreadCount = (props) => {
    let {readComment} = props
    const {unread} =  props
    
    const handleBadge = () => {
  
        if(props.channel.state.messages <= 0) {
            return (
            //    
            null
            )
        }
    }
    if(props.channel.type === 'messaging') {
            return (
            <>
            {props.unread > 0 ? <View style={styles.unreadContainer} >
                <Text style={styles.unreadText} >{props.unread}</Text>
            </View> : handleBadge()}
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