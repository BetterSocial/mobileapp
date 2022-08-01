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
        marginRight: 11
    },
    unreadText: {
        color: colors.white,
        textAlign:'center',
        fontSize: 12
    }
})


const CustomPreviewUnreadCount = (props) => {

    if(props.channel.type === 'messaging') {
         return (
          <>
        {props.unread > 0 ? <View style={styles.unreadContainer} >
            <Text style={styles.unreadText} >{props.unread}</Text>
        </View> : null}
        </>
    )
    }
    console.log(props.channel.isSeen, 'kimak')
    return (
        <>
        {props.channel.isSeen === false ?  <View style={[styles.unreadContainer, {marginLeft: 'auto', marginRight: 4}]} >
            
        </View> : null}
        </>
    )

   
}

export default CustomPreviewUnreadCount