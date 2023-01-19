import { renderHook } from '@testing-library/react-hooks'
import { act } from "@testing-library/react-native"
import useFollowing from "../../src/screens/Followings/hooks/useFollowing"
import * as serviceProfile from '../../src/service/profile'

describe('useFollowing should run correctly', () => {

    const response = {
        code: 200,
        data: [
            {
                follow_action_id: "3a6c905d-5977-4de8-8864-1fcad5b47b18",
                user: {
                    country_code: "ID",
                    createdAt: "2022-06-16T15:28:24.000Z",
                    human_id: "P19FGPQGMSZ5VSHA0YSQ---archive",
                    last_active_at: "2022-06-16T15:28:23.000Z",
                    profile_pic_asset_id: null,
                    profile_pic_path: "https://res.cloudinary.com/hpjivutj2/image/upload/v1617245336/Frame_66_1_xgvszh.png",
                    profile_pic_public_id: null,
                    real_name: null,
                    status: "Y",
                    updatedAt: "2022-06-16T15:28:24.000Z",
                    user_id: "cb683646-8ee7-4bf8-a442-bc398ad67210",
                    username: "Usupdev",
                },
                user_id_followed: "cb683646-8ee7-4bf8-a442-bc398ad67210",
                user_id_follower: "c6c91b04-795c-404e-b012-ea28813a2006",       
            }
        ]
    }

    const unfollowMock = [
        {
            follow_action_id: "3a6c905d-5977-4de8-8864-1fcad5b47b18",
                user: {
                    country_code: "ID",
                    createdAt: "2022-06-16T15:28:24.000Z",
                    human_id: "P19FGPQGMSZ5VSHA0YSQ---archive",
                    last_active_at: "2022-06-16T15:28:23.000Z",
                    profile_pic_asset_id: null,
                    profile_pic_path: "https://res.cloudinary.com/hpjivutj2/image/upload/v1617245336/Frame_66_1_xgvszh.png",
                    profile_pic_public_id: null,
                    real_name: null,
                    status: "Y",
                    updatedAt: "2022-06-16T15:28:24.000Z",
                    user_id: "cb683646-8ee7-4bf8-a442-bc398ad67210",
                    username: "Usupdev",
                },
                user_id_followed: "cb683646-8ee7-4bf8-a442-bc398ad67210",
                user_id_follower: "c6c91b04-795c-404e-b012-ea28813a2006",
                isunfollowed: true       
        }
    ]

    it('fetchFollowing should run correctly', () => {
        const navigation = {
            setOptions: jest.fn()
        }
        const spyGetFollowing = jest.spyOn(serviceProfile, 'getFollowing').mockImplementation(() => Promise.resolve(response))
        const {result} = renderHook(() => useFollowing({navigation}))
        act(() => {
            result.current.fetchFollowing(true)
        })
        expect(result.current.isLoading).toBeTruthy()
        expect(spyGetFollowing).toHaveBeenCalled()
    })

    it('handleResponseFetchFollowing should run correctly', () => {
         const navigation = {
            setOptions: jest.fn()
        }
        const {result} = renderHook(() => useFollowing({navigation}))
        act(() => {
            result.current.handleResponseFetchFollowing(response)
        })
        expect(result.current.isLoading).toBeFalsy()
        expect(result.current.dataFollowing).toEqual([
            {
                "description": null,
                "follow_action_id": "3a6c905d-5977-4de8-8864-1fcad5b47b18",
                 "image": "https://res.cloudinary.com/hpjivutj2/image/upload/v1617245336/Frame_66_1_xgvszh.png",
                 "name": "Usupdev",
                 user: {
                    country_code: "ID",
                    createdAt: "2022-06-16T15:28:24.000Z",
                    human_id: "P19FGPQGMSZ5VSHA0YSQ---archive",
                    last_active_at: "2022-06-16T15:28:23.000Z",
                    profile_pic_asset_id: null,
                    profile_pic_path: "https://res.cloudinary.com/hpjivutj2/image/upload/v1617245336/Frame_66_1_xgvszh.png",
                    profile_pic_public_id: null,
                    real_name: null,
                    status: "Y",
                    updatedAt: "2022-06-16T15:28:24.000Z",
                    user_id: "cb683646-8ee7-4bf8-a442-bc398ad67210",
                    username: "Usupdev",
                 },
                user_id_followed: "cb683646-8ee7-4bf8-a442-bc398ad67210",
                user_id_follower: "c6c91b04-795c-404e-b012-ea28813a2006",   
            }
        ])
    })

    it('handleSetUnFollow should run correctly', async () => {
         const navigation = {
            setOptions: jest.fn()
        }
        const spyUnfollow = jest.spyOn(serviceProfile, 'setUnFollow').mockImplementation(() => Promise.resolve())
        const {result} = renderHook(() => useFollowing({navigation}))
        await result.current.setDataFollowing(response.data)
        await result.current.handleSetUnFollow(0)
        expect(result.current.dataFollowing).toEqual([
            {
                follow_action_id: "3a6c905d-5977-4de8-8864-1fcad5b47b18",
                user: {
                    country_code: "ID",
                    createdAt: "2022-06-16T15:28:24.000Z",
                    human_id: "P19FGPQGMSZ5VSHA0YSQ---archive",
                    last_active_at: "2022-06-16T15:28:23.000Z",
                    profile_pic_asset_id: null,
                    profile_pic_path: "https://res.cloudinary.com/hpjivutj2/image/upload/v1617245336/Frame_66_1_xgvszh.png",
                    profile_pic_public_id: null,
                    real_name: null,
                    status: "Y",
                    updatedAt: "2022-06-16T15:28:24.000Z",
                    user_id: "cb683646-8ee7-4bf8-a442-bc398ad67210",
                    username: "Usupdev",
                },
                user_id_followed: "cb683646-8ee7-4bf8-a442-bc398ad67210",
                user_id_follower: "c6c91b04-795c-404e-b012-ea28813a2006",   
                isunfollowed: true    
            }
        ])
            expect(spyUnfollow).toHaveBeenCalled()

    })

    it('handleSetFollow should run correctly', async () => {
           const navigation = {
            setOptions: jest.fn()
        }
        const spyFollow = jest.spyOn(serviceProfile, 'setFollow').mockImplementation(() => Promise.resolve())
        const {result} = renderHook(() => useFollowing({navigation}))
        await result.current.setDataFollowing(unfollowMock)
        await result.current.handleSetFollow(0)
        expect(result.current.dataFollowing).toEqual([
            {
                follow_action_id: "3a6c905d-5977-4de8-8864-1fcad5b47b18",
                user: {
                    country_code: "ID",
                    createdAt: "2022-06-16T15:28:24.000Z",
                    human_id: "P19FGPQGMSZ5VSHA0YSQ---archive",
                    last_active_at: "2022-06-16T15:28:23.000Z",
                    profile_pic_asset_id: null,
                    profile_pic_path: "https://res.cloudinary.com/hpjivutj2/image/upload/v1617245336/Frame_66_1_xgvszh.png",
                    profile_pic_public_id: null,
                    real_name: null,
                    status: "Y",
                    updatedAt: "2022-06-16T15:28:24.000Z",
                    user_id: "cb683646-8ee7-4bf8-a442-bc398ad67210",
                    username: "Usupdev",
                },
                user_id_followed: "cb683646-8ee7-4bf8-a442-bc398ad67210",
                user_id_follower: "c6c91b04-795c-404e-b012-ea28813a2006",   
            }
        ])
        expect(spyFollow).toHaveBeenCalled()

    })

    it('goToOtherProfile should navigate to other page', async () => {
             const navigation = {
            setOptions: jest.fn(),
            navigate:jest.fn()
        }
        const {result} = renderHook(() => useFollowing({navigation}))
        await result.current.setUserId('123')
        await result.current.goToOtherProfile({user: {username: 'agita', user_id_followed: '1234'}})

        expect(navigation.navigate).toHaveBeenCalled()
    })
})
