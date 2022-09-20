import { getFeedNotification } from "../../../service/feeds"
import { getSpecificCache, saveToCache } from "../../../utils/cache"
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

    const getPostNotificationHook = async () => {
        const res = await getFeedNotification()
        if(res.success) {
            return res.data
        }
        return []
    }

    const handleCacheCommentHook  = () => new Promise((resolve) => {
                getSpecificCache(FEED_COMMENT_COUNT, (cache) => {
                resolve(cache)
            })
        })
    

    return {mappingUnreadCountPostNotifHook, handleNotHaveCacheHook, handleUpdateCacheHook, getPostNotificationHook, handleCacheCommentHook}

}


export default useChannelList