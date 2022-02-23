import React, {memo} from 'react'
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment'
import { COLORS } from '../../../../utils/theme'
import {Context} from '../../../../context';
import MemoIc_arrow_down_vote_on from '../../../../assets/arrow/Ic_downvote_on';
import MemoIc_arrow_upvote_on from '../../../../assets/arrow/Ic_upvote_on';
import MemoIc_comment from '../../../../assets/icons/Ic_comment';
import MemoIc_block_inactive from '../../../../assets/block/Ic_block_inactive';

const styles = StyleSheet.create({
    containerCard: {
        paddingHorizontal: 16,
        backgroundColor: 'white',
        borderBottomColor: '#f2f2f2',
        borderBottomWidth: 2,
        paddingVertical: 5,
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
    },
    descriptionContainer: {
        flexDirection: 'row',
        marginTop: 5,
        alignItems: 'center'
    },
    row: {
        flexDirection: 'row'
    },
    avatarNoHeight: {
        width: 40
    },
    centerAlign: {
        alignItems: 'center'
    },
    mr10: {
        marginRight: 15
    },
    textVoteMargin: {
        marginRight: 5
    }
})


const ListFeedNotification = ({notif, onPress}) => {
    const [user] = React.useContext(Context).users;
    const [profile] = React.useContext(Context).profile;

    const handleDate = (reaction) => {
        if(reaction && reaction.updated_at) {
            console.log(reaction.updated_at, 'jamil')
            return moment(reaction.updated_at).format('dddd')
        }
        return ""
    }
    console.log(notif, profile, 'notif123')

    const handleReplyComment = () => {
        const actorId = notif.comments[0] && notif.comments[0].actor && notif.comments[0].actor.data && notif.comments[0].actor.id
        console.log(actorId, profile.myProfile.user_id, 'salak')
        if(actorId === profile.myProfile.user_id) {
            return "You"
        } else if(notif.comments[0] && notif.comments[0].reaction && notif.comments[0].reaction.parent !== "") {
            return `${notif.comments[0] 
                && notif.comments[0].actor 
                && notif.comments[0].actor.data 
                && notif.comments[0].actor.data.username} Replied to your comment`
        }
        else {
            return notif.comments[0] 
            && notif.comments[0].actor 
            && notif.comments[0].actor.data 
            && notif.comments[0].actor.data.username
        }
    }
    console.log(notif.comments[0].reaction.parent, 'pantat')
    return (
        <TouchableOpacity onPress={() => onPress(notif.activity_id)} style={styles.containerCard} >
            <View style={styles.row} >
            <View style={styles.avatarContainer} >
                {notif.postMaker && notif.postMaker.data ? <Image source={{ uri: notif.postMaker.data.profile_pic_url }} style={styles.avatar} /> : null}
            </View>
            <View style={styles.titleContainer} >
                {notif.postMaker && notif.postMaker.data ? <Text style={styles.titleText} >{notif.postMaker.data.username}'s post : {notif.titlePost}</Text> : null}
                
                <Text style={styles.subtitleStyle} >
                    <Text style={styles.titleText} >
                    {handleReplyComment()} :
                    </Text>
                  
                    {" "}
                    {notif.comments[0] 
                    && notif.comments[0].reaction 
                    && notif.comments[0].reaction.data 
                    && notif.comments[0].reaction.data.text} </Text>
            </View>
            <View style={styles.lastContentContainer} >
                <Text>{handleDate(notif.comments[0] && notif.comments[0].reaction)} </Text>
            </View>
            </View>
         
            <View style={[styles.descriptionContainer]} >
                <View style={[styles.avatarContainer, styles.avatarNoHeight]} />
                <View style={[styles.row, styles.centerAlign, styles.mr10]} >
                    <Text style={styles.textVoteMargin} >
                        {notif.upvote}
                    </Text>
                    <MemoIc_arrow_down_vote_on width={15} height={15} />
                </View>
                <View style={[styles.row, styles.centerAlign, styles.mr10]} >
                    <Text style={styles.textVoteMargin} >
                        {notif.downvote}
                    </Text>
                    <MemoIc_arrow_upvote_on width={15} height={15} />
                </View>
                <View style={[styles.row, styles.centerAlign, styles.mr10]} >
                    <Text style={styles.textVoteMargin} >
                        {notif.comments.length}
                    </Text>
                    <MemoIc_comment width={15} height={15} />
                </View>
                <View style={[styles.row, styles.centerAlign, styles.mr10]} >
                    <Text style={styles.textVoteMargin} >
                        {String(notif.block)}
                    </Text>
                    <MemoIc_block_inactive width={15} height={15} />
                </View>
            </View>
        </TouchableOpacity>
    )
}

ListFeedNotification.propTypes = {
    notif: PropTypes.object,
    onPress: PropTypes.func
}


export default memo(ListFeedNotification, (prevProps, nextProps) => {
    prevProps.notif === nextProps.notif
})