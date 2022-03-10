import PropTypes from 'prop-types';
import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'

import ListFeedNotification from './components/ListFeedNotification'
import streamFeed from '../../../utils/getstream/streamer'
import { COLORS } from '../../../utils/theme'
import { getAccessToken } from '../../../utils/token'
import { getFeedNotification } from '../../../service/feeds'
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
    const {userid, navigation} = props
    const [listNotif, setListNotif] = React.useState([])

    const callStreamFeed = async () => {
        const token = await getAccessToken()
        console.log(token, 'nani')
        const client = streamFeed(token)
        const notif = client.feed('notification', userid, token)
        console.log('skita')
        notif.subscribe(function (data) {
            console.log(data, 'kulakan')
            getPostNotification()

        })

        // client.feed(getAccessToken())
    }

    const onDetailFeed = (id) => {
        console.log(id, 'saman')
        navigation.navigate('PostDetailPage', {
            feedId: id
        })
    }

    const getPostNotification = async () => {
        const res = await getFeedNotification()
        if(res.success) {
            setListNotif(res.data)
        }
    }

    React.useEffect(() => {
        if(userid) {
            callStreamFeed()
        }

    }, [userid])

    React.useEffect(() => {
        getPostNotification()
    }, [])

    return (
        <React.Fragment>
            {listNotif.map((notif, index) => (
                <ListFeedNotification onPress={onDetailFeed} notif={notif} key={index} />
            ))}
        </React.Fragment>
    )
}

FeedNotification.propTypes = {
    userid: PropTypes.string,
    navigation: PropTypes.object
}


export default FeedNotification