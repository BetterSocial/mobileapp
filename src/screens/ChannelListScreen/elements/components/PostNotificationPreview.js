/* eslint-disable camelcase */
import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { useTheme } from 'stream-chat-react-native-core/src/contexts/themeContext/ThemeContext';
import { calculateTime } from 'stream-chat-react-native-core/src/components/ChannelList/customUtils';
import ButtonHighlight from 'stream-chat-react-native-core/src/components/ChannelPreview/ButtonHighlight'
import MemoIc_arrow_down_vote_on from '../../../../assets/arrow/Ic_downvote_on';
import MemoIc_arrow_upvote_on from '../../../../assets/arrow/Ic_upvote_on';
import MemoIc_comment from '../../../../assets/icons/Ic_comment';
import MemoIc_block_inactive from '../../../../assets/block/Ic_block_inactive';
import Imageblock from '../../../../assets/images/block.png'
import {Context} from '../../../../context'

import AvatarPostNotif from './AvatarPostNotif';

const styles = StyleSheet.create({
    containerCard: {
        paddingHorizontal: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        paddingVertical: 12,
        justifyContent: 'center'
    },
    avatar: {
        height: 40,
        width: 40,
        borderRadius: 20
    },
    avatarContainer: {
        marginRight: 0,
    },
    titleText: {
        // fontWeight: 'bold',
        flex: 1,
        fontSize: 12,
        flexShrink: 1,
    },
    lastContentContainer: {
        marginLeft: 'auto',
        backgroundColor: 'red',
     
    },
    titleContainer: {
        maxWidth: '70%',
    },
    subtitleStyle: {
        // color: '#6A6A6A',
        flex: 1,
        // marginTop:3,
        fontSize: 12,
        // flexShrink: 1,
    },
    descriptionContainer: {
        flexDirection: 'row',
        marginTop: 5,
        alignItems: 'center',
        paddingLeft: 15,
    },
    row: {
        flexDirection: 'row',
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
        marginRight: 0,
        width: 30
    },
    dateFont: {
        fontSize: 12,
        marginLeft: 'auto'
    },
    titleTextBig: {
        fontSize: 14,
        fontWeight: '700'
    },
    iconMargin: {
        marginRight: 5
    },
    replyContainer: {
        flexDirection: 'row',
        marginTop: 3,
    },
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




const PostNotificationPreview = ({item, index, onSelectAdditionalData, countPostNotif}) => {
    // const [profile] = context.profile
    const [profile] = React.useContext(Context).profile;
    const {myProfile} = profile

    const {
        theme: {
          colors: { border, grey },
        },
      } = useTheme();
    
    const handleReplyComment = () => {
        const findComment = item.comments.find((data) => data.reaction.kind === 'comment')
        if(findComment) {
            const actorId = findComment.actor && findComment.actor.data && findComment.actor.data.id
            if(actorId === myProfile.user_id && !item.isAnonym) {
                return `You: ${findComment.reaction.data.text} `
            }if(findComment.reaction.parent !== "" && !item.isAnonym) {
                return findComment && findComment.actor && findComment.actor.data && `${findComment.actor.data.username  } replied to your comment: ${findComment.reaction.data.text} `
            }
            if(!item.isAnonym) {
                return findComment.actor.data && `${findComment.actor.data.username  }: ${findComment.reaction.data.text} `
            }
            return `Anonymous: ${findComment.reaction.data.text}` 
        }
        return "No comments yet"
    }

    const handleDate = () => {
        if(item.data && item.data.last_message_at) {
            calculateTime(item.data.last_message_at)

        }
        return null
    }
    return (
        <ButtonHighlight key={index} onPress={() => onSelectAdditionalData(item)}  style={[styles.containerCard, {borderBottomColor: border}]} >
            <View style={[styles.row]} >
                {item.postMaker && item.postMaker.data ?<AvatarPostNotif item={item} /> : null}
            <View style={{flex: 1,  paddingLeft: 8, justifyContent: 'center'}} >
                <View style={styles.row} >
                {item.postMaker && item.postMaker.data ? <Text numberOfLines={1} style={[styles.titleTextBig, {maxWidth: '85%'}]} >{item.postMaker.id === myProfile.user_id ? "Your post" : item.postMaker.data.username}: {item.titlePost}</Text> : null}
                <Text style={[styles.dateFont]} >{handleDate()} </Text>

                </View>
                <View style={[styles.replyContainer]} >
                    {Array.isArray(item.comments) && item.comments.length > 0 ?                    
                    <Text numberOfLines={1} style={[styles.subtitleStyle, {color: grey, marginTop: 'auto'}]} >{handleReplyComment()}</Text> : <Text numberOfLines={1} style={[styles.subtitleStyle, {color: grey, marginTop: 'auto'}]} >No comments yet</Text>}

        
                 
                    {countPostNotif && typeof countPostNotif === 'function' ? countPostNotif(item) : null}
           
                </View>
               
            </View>
           
            </View>
                {item.postMaker.id === myProfile.user_id ? 
                   <View style={[styles.descriptionContainer]} >
                <View style={[styles.avatarContainer, styles.avatarNoHeight]} />
                     <React.Fragment>
                <View style={[styles.row, styles.centerAlign, styles.mr10]} >
                <MemoIc_arrow_upvote_on style={styles.iconMargin} width={15} height={15} />
                    <Text style={styles.textVoteMargin} >
                        {item.upvote}
                    </Text>
                </View>
                <View style={[styles.row, styles.centerAlign, styles.mr10]} >
                <MemoIc_arrow_down_vote_on style={styles.iconMargin} width={15} height={15} />
                    <Text style={styles.textVoteMargin} >
                        {item.downvote}
                    </Text>
                </View>
                <View style={[styles.row, styles.centerAlign, styles.mr10]} >
                <MemoIc_comment style={styles.iconMargin} width={15} height={15} />
                    <Text style={styles.textVoteMargin} >
                        {item.totalComment}
                    </Text>
                </View>
                <View style={[styles.row, styles.centerAlign, styles.mr10]} >
                {Number(item.block) > 0 ?  <Image source={Imageblock} style={styles.iconMargin} width={15} height={15} /> : <MemoIc_block_inactive style={styles.iconMargin} width={15} height={15} />}
                    <Text style={styles.textVoteMargin} >
                        {String(item.block)}
                    </Text>
                </View>
                </React.Fragment>
         
                
            </View>  : null
            }
                
        </ButtonHighlight>
    )
}


export default React.memo (PostNotificationPreview, (prevProps, nextProps) => prevProps.item === nextProps.item)