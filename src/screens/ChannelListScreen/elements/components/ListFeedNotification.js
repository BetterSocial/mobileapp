import React, {memo} from 'react'
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { COLORS } from '../../../../utils/theme'
import {Context} from '../../../../context';

const styles = StyleSheet.create({
    containerCard: {
        paddingHorizontal: 16,
        backgroundColor: 'white',
        borderBottomColor: '#f2f2f2',
        borderBottomWidth: 2,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10
    },
    avatar: {
        height: 40,
        width: 40
    },
    avatarContainer: {
        marginRight: 10,
    },
    titleText: {
        fontWeight: 'bold',
    },
    lastContentContainer: {
        marginLeft: 'auto'
    },
    titleContainer: {
        maxWidth: '70%',
    },
    subtitleStyle: {
        color: COLORS.gray
    }
})


const ListFeedNotification = ({notif}) => {
    const [user] = React.useContext(Context).users;
    const [profile] = React.useContext(Context).profile;

    console.log(profile, user, 'sapilak')
    return (
        <TouchableOpacity style={styles.containerCard} >
            <View style={styles.avatarContainer} >
                {user.photoUrl ? <Image source={{ uri: user.photoUrl }} style={styles.avatar} /> : null}
            </View>
            <View style={styles.titleContainer} >
                <Text style={styles.titleText} >{profile.myProfile && profile.myProfile.username}'s post : {notif.activities[0] && notif.activities[0].object.message}</Text>
                <Text style={styles.subtitleStyle} >
                    {notif.activities[0] 
                    && notif.activities[0].actor 
                    && notif.activities[0].actor.data 
                    && notif.activities[0].actor.data.username}
                    {" "}
                    {notif.activities[0] 
                    && notif.activities[0].reaction 
                    && notif.activities[0].reaction.data 
                    && notif.activities[0].reaction.data.text} </Text>
            </View>
            <View style={styles.lastContentContainer} >
                <Text>Thursday</Text>
            </View>
        </TouchableOpacity>
    )
}

ListFeedNotification.propTypes = {
    notif: PropTypes.object
}


export default memo(ListFeedNotification, (prevProps, nextProps) => {
    prevProps.notif === nextProps.notif
})