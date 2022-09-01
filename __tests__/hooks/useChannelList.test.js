import { renderHook } from '@testing-library/react-hooks'
import useChannelList from '../../src/screens/ChannelListScreen/hooks/useChannelList'


describe('function channel list should run correctly', () => {
         const listNotif = [
            {
            activity_id: "4e11d509-2276-11ed-a9f6-124f97b82f95",
            isSeen: true,
            totalComment: 15,
            totalCommentBadge: 10,
            isRead: true,
            unreadComment: 0,
            type: "post-notif",
            titlePost: "#maingame terusss",
            downvote: 0,
            upvote: 0,
            block: 0,
            "postMaker": {
                "created_at": "2022-06-10T13:11:53.385703Z",
                "updated_at": "2022-07-29T12:54:03.879150Z",
                "id": "c6c91b04-795c-404e-b012-ea28813a2006",
                "data": {
                    "human_id": "I4K3M10FGR78EWQQDNQ2",
                    "profile_pic_url": "https://res.cloudinary.com/hpjivutj2/image/upload/v1659099243/pbdv3jlyd4mhmtis6kqx.jpg",
                    "username": "Agita"
                }
            },
            isAnonym: false,
            },
            {
            activity_id: "3e11d509-2276-11ed-a9f6-124f97b82f98",
            isSeen: true,
            totalComment: 15,
            totalCommentBadge: 25,
            isRead: true,
            unreadComment: 0,
            type: "post-notif",
            titlePost: "#maingame terusss",
            downvote: 0,
            upvote: 0,
            block: 0,
            "postMaker": {
                "created_at": "2022-06-10T13:11:53.385703Z",
                "updated_at": "2022-07-29T12:54:03.879150Z",
                "id": "c6c91b04-795c-404e-b012-ea28813a2006",
                "data": {
                    "human_id": "I4K3M10FGR78EWQQDNQ2",
                    "profile_pic_url": "https://res.cloudinary.com/hpjivutj2/image/upload/v1659099243/pbdv3jlyd4mhmtis6kqx.jpg",
                    "username": "Agita"
                }
            },
               isAnonym: true,
            }
        ]
        const readCount = {
            "4e11d509-2276-11ed-a9f6-124f97b82f95": 3
        }
    it('counting total post notif should run correctly', () => {
   
        const {result} = renderHook(useChannelList)
        expect(result.current.mappingUnreadCountPostNotifHook(listNotif, readCount)).toStrictEqual(32)
        
    })

    it('handle not have cache count should correctly', () => {
        const {result} = renderHook(useChannelList)
        expect(result.current.handleNotHaveCacheHook(listNotif)).toStrictEqual({"4e11d509-2276-11ed-a9f6-124f97b82f95": 0, "3e11d509-2276-11ed-a9f6-124f97b82f98": 0})
    })

    it('handle update cache should be correct', () => {
        const {result} = renderHook(useChannelList)
        expect(result.current.handleUpdateCacheHook(readCount, "4e11d509-2276-11ed-a9f6-124f97b82f95", 15)).toStrictEqual({...readCount, "4e11d509-2276-11ed-a9f6-124f97b82f95": 15})
    })

    it('handle avatar chat should run correctly', () => {
        const defaultAvatar ='https://firebasestorage.googleapis.com/v0/b/bettersocial-dev.appspot.com/o/anonym.png?alt=media&token=5ffe7504-c0e7-4a0c-9cbb-3e7b7572886f'
        const {result} = renderHook(useChannelList)
        expect(result.current.handleAvatarPostChat(listNotif[0])).toStrictEqual(listNotif[0].postMaker.data.profile_pic_url)
        expect(result.current.handleAvatarPostChat(listNotif[1])).toStrictEqual(defaultAvatar)
    })
})