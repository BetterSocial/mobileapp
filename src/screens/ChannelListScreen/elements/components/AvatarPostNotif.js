import React from 'react'
import { View, Image, StyleSheet } from 'react-native'
import {Avatar} from 'stream-chat-react-native-core/src/components/Avatar/Avatar'
import FeedIcon from '../../../../assets/images/feed-icon.png'
import useChannelList from '../../hooks/useChannelList'

const styles = StyleSheet.create({
     iconStyle: {
        height: 12, width: 12,
    },
    iconContainerStyle: {
        backgroundColor:'#55C2FF'
    },
    typeContainer: {
        height: 24,
        width: 24,
        backgroundColor: '#55C2FF',
        borderRadius: 12,
        position: 'absolute',
        bottom: -6,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        borderWidth: 1,
        borderColor: 'white'
    }
})

const AvatarPostNotif = ({item}) => {
    const {handleAvatarPostChat} = useChannelList()

    return (
        <Avatar childrenType={<View style={styles.typeContainer} ><Image resizeMode='contain' source={FeedIcon} style={styles.iconStyle} /></View>} showType={true} size={48} image={handleAvatarPostChat(item)} />
    )
}


export default React.memo (AvatarPostNotif, (prevProps, nextProps) => prevProps.item === nextProps.item)