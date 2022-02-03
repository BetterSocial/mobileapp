import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { COLORS } from '../../../utils/theme'
import streamFeed from '../../../utils/getstream/streamer'
import { getAccessToken } from '../../../utils/token'
import PropTypes from 'prop-types';
const styles = StyleSheet.create({
    containerCard: {
        padding: 16,
        backgroundColor: 'white',
        borderBottomColor: '#f2f2f2',
        borderBottomWidth: 2,
        flexDirection: 'row',
    },
    avatar: {
        height: 40,
        width: 40
    },
    avatarContainer: {
        marginRight: 10,
    },
    titleText: {
        fontWeight: 'bold'
    },
    lastContentContainer: {
        marginLeft: 'auto'
    },
    titleContainer: {
        maxWidth: '70%'
    },
    subtitleStyle: {
        color: COLORS.gray
    }
})

const FeedNotification = (props) => {
    const {userid} = props

    const callStreamFeed = async () => {
        const token = await getAccessToken()
        console.log(token, 'nani')
        const client = streamFeed(token)
        const notif = client.feed('notification', userid, token)
        console.log('skita')
        notif.subscribe(function (data) {
            console.log(data, 'kulakan')
            notif.get().then((data) => {
                console.log(data, 'mantap')
            })
        })

        // client.feed(getAccessToken())
    }

    React.useEffect(() => {
        if(userid) {
            callStreamFeed()
        }

    }, [userid])

    return (
        <View style={styles.containerCard} >
            <View style={styles.avatarContainer} >
                <Image source={{ uri: "https://cdn-icons-png.flaticon.com/512/147/147144.png" }} style={styles.avatar} />
            </View>
            <View style={styles.titleContainer} >
                <Text style={styles.titleText} >Your post haha is commented</Text>
                <Text style={styles.subtitleStyle} >Hi bro how are you ? </Text>
            </View>
            <View style={styles.lastContentContainer} >
                <Text>Thursday</Text>
            </View>
        </View>
    )
}

FeedNotification.propTypes = {
    userid: PropTypes.string
}


export default FeedNotification