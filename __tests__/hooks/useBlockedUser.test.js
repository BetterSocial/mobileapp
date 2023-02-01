import { act } from "@testing-library/react-native"
import { renderHook } from '@testing-library/react-hooks'

import * as serviceBlock from '../../src/service/blocking';
import * as serviceUser from '../../src/service/users'
import useBlockedUser from "../../src/screens/Blocked/elements/UserScreen/hooks/useBlockedUser"

jest.useFakeTimers()

describe('useBlockUser should run correctly', async () => {
     const mockUserBlock = [
        {
            blocked_action_id: "cfd56df6-3b55-47f8-9508-2fae30e30d1c",
            description: null,
            image: "https://res.cloudinary.com/hpjivutj2/image/upload/v1660620884/nrfnzuhcrozz9v34ngv3.jpg",
            name: "Fajarism",
            user: {
                country_code: "ID",
                createdAt: "2022-06-10T13:11:47.000Z",
                human_id: "HQEGNQCHA8J1OIX4G2CP",
                last_active_at: "2022-06-10T13:11:47.000Z",
                profile_pic_asset_id: "ced7d7dd2c500ebda706147a8f564b4b",
                profile_pic_path: "https://res.cloudinary.com/hpjivutj2/image/upload/v1660620884/nrfnzuhcrozz9v34ngv3.jpg",
                profile_pic_public_id: "nrfnzuhcrozz9v34ngv3",
                real_name: null,
                status: "Y",
                updatedAt: "2022-08-16T03:34:45.000Z",
                user_id: "f19ce509-e8ae-405f-91cf-ed19ce1ed96e",
                username: "Fajarism",

            },
            user_id_blocked: "f19ce509-e8ae-405f-91cf-ed19ce1ed96e",
            user_id_blocker: "c6c91b04-795c-404e-b012-ea28813a2006",
        }
    ]
    const mockUser2 = [
         {
            blocked_action_id: "cfd56df6-3b55-47f8-9508-2fae30e30d1c",
            description: null,
            image: "https://res.cloudinary.com/hpjivutj2/image/upload/v1660620884/nrfnzuhcrozz9v34ngv3.jpg",
            name: "Fajarism",
            user: {
                country_code: "ID",
                createdAt: "2022-06-10T13:11:47.000Z",
                human_id: "HQEGNQCHA8J1OIX4G2CP",
                last_active_at: "2022-06-10T13:11:47.000Z",
                profile_pic_asset_id: "ced7d7dd2c500ebda706147a8f564b4b",
                profile_pic_path: "https://res.cloudinary.com/hpjivutj2/image/upload/v1660620884/nrfnzuhcrozz9v34ngv3.jpg",
                profile_pic_public_id: "nrfnzuhcrozz9v34ngv3",
                real_name: null,
                status: "Y",
                updatedAt: "2022-08-16T03:34:45.000Z",
                user_id: "f19ce509-e8ae-405f-91cf-ed19ce1ed96e",
                username: "Fajarism",

            },
            user_id_blocked: "f19ce509-e8ae-405f-91cf-ed19ce1ed96e",
            user_id_blocker: "c6c91b04-795c-404e-b012-ea28813a2006",
        },
         {
            blocked_action_id: "cfd56df6-3b55-47f8-9508-2fae30e30d1c",
            description: null,
            image: "https://res.cloudinary.com/hpjivutj2/image/upload/v1660620884/nrfnzuhcrozz9v34ngv3.jpg",
            name: "Fajarism",
            user: {
                country_code: "ID",
                createdAt: "2022-06-10T13:11:47.000Z",
                human_id: "HQEGNQCHA8J1OIX4G2CP",
                last_active_at: "2022-06-10T13:11:47.000Z",
                profile_pic_asset_id: "ced7d7dd2c500ebda706147a8f564b4b",
                profile_pic_path: "https://res.cloudinary.com/hpjivutj2/image/upload/v1660620884/nrfnzuhcrozz9v34ngv3.jpg",
                profile_pic_public_id: "nrfnzuhcrozz9v34ngv3",
                real_name: null,
                status: "Y",
                updatedAt: "2022-08-16T03:34:45.000Z",
                user_id: "f19ce509-e8ae-405f-91cf-ed19ce1ed96e",
                username: "Agita",

            },
            user_id_blocked: "f19ce509-e8ae-405f-91cf-ed19ce1ed96e",
            user_id_blocker: "c6c91b04-795c-404e-b012-ea28813a2006",
        }
    ]

    it('fetchData should call api list block', () => {
        const navigation = {
            setOptions: jest.fn()
        }
        const spyServiceBlock = jest.spyOn(serviceUser, 'getBlockedUserList')
        const {result} = renderHook(() => useBlockedUser({navigation}))
        act(() => {
            result.current.handleFetchData()
        })
        expect(spyServiceBlock).toHaveBeenCalled()
    })

    it('handleResponseFetchData should save sata correctly', () => {
         const navigation = {
            setOptions: jest.fn()
        }
        const {result} = renderHook(() => useBlockedUser({navigation}))
        const responseData = {
            success: true,
            data: mockUserBlock
        }
        act(() => {
            result.current.handleResponseFetchData(responseData)
        })
        expect(result.current.isLoading).toBeFalsy()
        expect(result.current.listBlockedUser).toEqual(mockUserBlock)
        act(() => {
            result.current.handleResponseFetchData({success: false})
        })
               expect(result.current.isLoading).toBeFalsy()

    })

    it('handleBlockUser should run correctly', () => {
               const navigation = {
            setOptions: jest.fn()
        }
        const spyBlock = jest.spyOn(serviceBlock, 'blockUser')
        const {result} = renderHook(() => useBlockedUser({navigation}))
        act(() => {
            result.current.handleBlockUser(mockUserBlock[0])
        })
        expect(spyBlock).toHaveBeenCalled()
    })

    it('handleResponseBlockUser should map correctly', () => {
                       const navigation = {
            setOptions: jest.fn()
        }
        const {result} = renderHook(() => useBlockedUser({navigation}))
        const mappingData = [
            {
                blocked_action_id: "7db99bdb-11aa-4561-9862-8f4f1c12a6a0",
                description: null,
                image: "https://res.cloudinary.com/hpjivutj2/image/upload/v1660620884/nrfnzuhcrozz9v34ngv3.jpg",
                isUnblocked: false,
                name: "Fajarism",
                user: {
                    country_code: "ID",
                    createdAt: "2022-06-10T13:11:47.000Z",
                    human_id: "HQEGNQCHA8J1OIX4G2CP",
                    last_active_at: "2022-06-10T13:11:47.000Z",
                    profile_pic_asset_id: "ced7d7dd2c500ebda706147a8f564b4b",
                    profile_pic_path: "https://res.cloudinary.com/hpjivutj2/image/upload/v1660620884/nrfnzuhcrozz9v34ngv3.jpg",
                    profile_pic_public_id: "nrfnzuhcrozz9v34ngv3",
                    real_name: null,
                    status: "Y",
                    updatedAt: "2022-08-16T03:34:45.000Z",
                    user_id: "f19ce509-e8ae-405f-91cf-ed19ce1ed96e",
                    username: "Fajarism",
                },
                user_id_blocked: "f19ce509-e8ae-405f-91cf-ed19ce1ed96e",
                user_id_blocker: "c6c91b04-795c-404e-b012-ea28813a2006",
            }
        ]
        act(() => {
            result.current.handleResponseBlockUser({code: 200, data: {blocked_action_id: "bee8e641-3961-4420-a461-bcf7fb4f5303",post_id: null, user_id_blocked: "f19ce509-e8ae-405f-91cf-ed19ce1ed96e",user_id_blocker: "c6c91b04-795c-404e-b012-ea28813a2006"}}, mappingData)
        })
        expect(result.current.listBlockedUser).toEqual(mappingData)
    })

        it('handleUnBlockUser should run correctly', async () => {
               const navigation = {
            setOptions: jest.fn()
        }
        const spyUnBlock = jest.spyOn(serviceBlock, 'unblockUserApi')
        const {result} = renderHook(() => useBlockedUser({navigation}))
        await  result.current.handleUnblockUser(mockUserBlock[0])
        expect(spyUnBlock).toHaveBeenCalled()
    })

    it('handleTabbarName should run correctly', async () => {
                 const navigation = {
            setOptions: jest.fn()
        }
        const {result} = renderHook(() => useBlockedUser({navigation}))
        await result.current.setListBlockedUser(mockUserBlock)
        await  result.current.handleTabbarName()
        expect(result.current.handleTabbarName()).toEqual(`User (${mockUserBlock.length})`)
        expect(navigation.setOptions).toHaveBeenCalled()
        await result.current.setListBlockedUser(mockUser2)
        expect(result.current.handleTabbarName()).toEqual(`Users (${mockUser2.length})`)
    })

    it('dataMap should map correctly', async () => {
                         const navigation = {
            setOptions: jest.fn()
        }
        const {result} = renderHook(() => useBlockedUser({navigation}))
        await result.current.setListBlockedUser(mockUserBlock)
        expect(result.current.dataMap(mockUserBlock[0], true)).toEqual([{
            blocked_action_id: "cfd56df6-3b55-47f8-9508-2fae30e30d1c",
            description: null,
            image: "https://res.cloudinary.com/hpjivutj2/image/upload/v1660620884/nrfnzuhcrozz9v34ngv3.jpg",
             "isUnblocked": true,
            name: "Fajarism",
            user: {
                country_code: "ID",
                createdAt: "2022-06-10T13:11:47.000Z",
                human_id: "HQEGNQCHA8J1OIX4G2CP",
                last_active_at: "2022-06-10T13:11:47.000Z",
                profile_pic_asset_id: "ced7d7dd2c500ebda706147a8f564b4b",
                profile_pic_path: "https://res.cloudinary.com/hpjivutj2/image/upload/v1660620884/nrfnzuhcrozz9v34ngv3.jpg",
                profile_pic_public_id: "nrfnzuhcrozz9v34ngv3",
                real_name: null,
                status: "Y",
                updatedAt: "2022-08-16T03:34:45.000Z",
                user_id: "f19ce509-e8ae-405f-91cf-ed19ce1ed96e",
                username: "Fajarism",

            },
            user_id_blocked: "f19ce509-e8ae-405f-91cf-ed19ce1ed96e",
            user_id_blocker: "c6c91b04-795c-404e-b012-ea28813a2006",
        }])
                expect(result.current.dataMap(mockUserBlock[0], false)).toEqual([{
            blocked_action_id: "cfd56df6-3b55-47f8-9508-2fae30e30d1c",
            description: null,
            image: "https://res.cloudinary.com/hpjivutj2/image/upload/v1660620884/nrfnzuhcrozz9v34ngv3.jpg",
             "isUnblocked": false,
            name: "Fajarism",
            user: {
                country_code: "ID",
                createdAt: "2022-06-10T13:11:47.000Z",
                human_id: "HQEGNQCHA8J1OIX4G2CP",
                last_active_at: "2022-06-10T13:11:47.000Z",
                profile_pic_asset_id: "ced7d7dd2c500ebda706147a8f564b4b",
                profile_pic_path: "https://res.cloudinary.com/hpjivutj2/image/upload/v1660620884/nrfnzuhcrozz9v34ngv3.jpg",
                profile_pic_public_id: "nrfnzuhcrozz9v34ngv3",
                real_name: null,
                status: "Y",
                updatedAt: "2022-08-16T03:34:45.000Z",
                user_id: "f19ce509-e8ae-405f-91cf-ed19ce1ed96e",
                username: "Fajarism",

            },
            user_id_blocked: "f19ce509-e8ae-405f-91cf-ed19ce1ed96e",
            user_id_blocker: "c6c91b04-795c-404e-b012-ea28813a2006",
        }])
    })
   
})


//    const dataMap = (data, status) => {
//         const mappingData = listBlockedUser.map((blocked) => {
//         if(blocked.user_id_blocked === data.user_id_blocked) {
//             return {...blocked, isUnblocked: status}
//         }
//         return {...blocked} 
//     })
//     return mappingData
//    }

//  const handleTabbarName = () => {
//         let title = "User"
//         if(listBlockedUser.length === 1) {
//         title += ` (${listBlockedUser.length})`
//         }
//         if(listBlockedUser.length > 1) {
//         title = `Users (${listBlockedUser.length})`
//         }
//         navigation.setOptions({
//         title,
//         }); 
//    }


    // const handleResponseFetchData = (userList) => {
    //      if(userList.success) {
    //         const mappingData = userList.data.map((data) => ({ ...data, name: data.user.username, image: data.user.profile_pic_path, description: null}))
    //         setListBlockedUser(mappingData)
    //         return setIsLoading(false)
    //     }
    //     return setIsLoading(false)
    // }


//        const handleBlockUser = async (data) => {
//         const mappingData = listBlockedUser.map((blocked) => {
//             if(blocked.user_id_blocked === data.user_id_blocked) {
//                 return {...blocked, isUnblocked: false }
//             }
//             return {...blocked} 
//         })
//         const dataSend = {
//             userId: data.user_id_blocked,
//             source: 'blocklist_screen',
//         };
//         const blockingUser = await blockUser(dataSend);
//         handleResponseBlockUser(blockingUser, mappingData)
//         // if(blockingUser.code === 200) {
//         //     setListBlockedUser(mappingData)
//         // }
//    }

//    const handleResponseBlockUser = (blockingUser, mappingData) => {
//      if(blockingUser.code === 200) {
//             setListBlockedUser(mappingData)
//         }
//    }