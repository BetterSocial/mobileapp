import { saveToCache } from "../../../utils/cache"
import { FEED_COMMENT_COUNT } from "../../../utils/cache/constant"


const useChannelList = () => {
   

    const mappingUnreadCountPostNotifHook = (listPostNotif = [], countReadComment) => {
        let message = 0
        if(listPostNotif.length > 0) {
            const maping = listPostNotif.map((notif) => ({id: notif.activity_id, totalComment: notif.totalCommentBadge}))
            const mapCount = maping.map((data) => ({
                    ...data,
                    totalComment: data.totalComment -( countReadComment[data.id] || 0)
                }))
            const countTotal = mapCount.map((count) => count.totalComment).reduce((a, b) => a + b)
            const totalMessage = countTotal
            message = totalMessage
        }
        return message

    }
    const handleNotHaveCacheHook = (listPostNotif = []) => {
        let comment = {}
        listPostNotif.forEach((data) => {
            comment = {...comment, [data.activity_id]: 0}
        })
        saveToCache(FEED_COMMENT_COUNT, comment)
        return comment
    }

    const handleUpdateCacheHook = (countReadComment, id, totalComment) => {
        const updateReadCache = {...countReadComment, [id]: totalComment}
        saveToCache(FEED_COMMENT_COUNT, updateReadCache)
        return updateReadCache
    }

    const handleAvatarPostChat = (item) => {
        if(item.isAnonym) {
            return 'https://firebasestorage.googleapis.com/v0/b/bettersocial-dev.appspot.com/o/anonym.png?alt=media&token=5ffe7504-c0e7-4a0c-9cbb-3e7b7572886f'
        }
        return item.postMaker.data.profile_pic_url
    }

    const handleReplyCommentPostHook = (item, myProfile) => {
        const actorId = item.comments[0] && item.comments[0].actor && item.comments[0].actor.data && item.comments[0].actor.id
        if(actorId === myProfile.user_id && !item.isAnonym) {
            return "You"
        } if(item.comments[0] && item.comments[0].reaction && item.comments[0].reaction.parent !== "" && !item.isAnonym) {
            return `${item.comments[0] 
                && item.comments[0].actor 
                && item.comments[0].actor.data 
                && item.comments[0].actor.data.username} replied to your comment`
        }
        
            if(!item.isAnonym) {
            return item.comments[0] 
            && item.comments[0].actor 
            && item.comments[0].actor.data 
            && item.comments[0].actor.data.username
            } 
            return 'Anonymous'
    }

    return {mappingUnreadCountPostNotifHook, handleNotHaveCacheHook, handleUpdateCacheHook, handleAvatarPostChat, handleReplyCommentPostHook}
}


export default useChannelList