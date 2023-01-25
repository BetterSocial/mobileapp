import React from 'react'
import { act, renderHook } from '@testing-library/react-hooks'
import { Context } from '../../src/context/Store'
import useGroupInfo from '../../src/screens/GroupInfo/hooks/useGroupInfo'
import * as groupChatService from '../../src/context/actions/groupChat';
import * as servicePermission from '../../src/utils/permission';
import * as launchGallery from 'react-native-image-picker'
import * as serviceFile from '../../src/service/file';
jest.mock('react-native-permissions', () =>
  require('react-native-permissions/mock'),
);


describe('useGroupInfo should run correctly', () => {

    beforeEach(() => {
        jest.spyOn(servicePermission, 'requestExternalStoragePermission').mockImplementation(() => ({success: true}))
        jest.spyOn(serviceFile, 'uploadFile').mockImplementation(() => ({data: {url: 'https://detik.jpg'}}))
    })

    const mockMyProfile = {
        bio: "Fe mobile engineer",
        country_code: "ID",
        createdAt: "2022-06-10T13:11:53.000Z",
        follower: 13,
        follower_symbol: "< 25",
        following: 10,
        following_symbol: "< 25",
        human_id: "I4K3M10FGR78EWQQDNQ2",
        last_active_at: "2022-06-10T13:11:53.000Z",
        location: [
            {
                city: "Yauco, PR",
                country: "US",
                createdAt: "2022-05-30T14:15:24.000Z",
                location_id: "45",
                location_level: "City",
                neighborhood: "",
                slug_name: "",
                state: "Puerto Rico",
                status: "Y",
                updatedAt: "2022-05-30T14:15:24.000Z",
            }
        ],
        profile_pic_asset_id: "6f47f70bea98469f4a24b6ffc550c983",
        profile_pic_path: "https://res.cloudinary.com/hpjivutj2/image/upload/v1659099243/pbdv3jlyd4mhmtis6kqx.jpg",
        profile_pic_public_id: "pbdv3jlyd4mhmtis6kqx",
        real_name: null,
        status: "Y",
        updatedAt: "2022-07-29T12:54:04.000Z",
        user_id: "c6c91b04-795c-404e-b012-ea28813a2006",
        username: "Agita",
    }

    const mockAsset = [
        {
            message: {
                cid: "messaging:c47d45f2-0dd9-4eaa-1600-4ff6e518199a",
                created_at: "2023-01-24T00:59:12.801526Z",
                html: "",
                id: "c6c91b04-795c-404e-b012-ea28813a2006-531b41e6-263b-4d6c-1c0e-e62f13357aef",
                latest_reactions: [],
                mentioned_users: [],
                attachments: [
                    {
                        image_url: "https://us-east.stream-io-cdn.com/114344/images/4d589ea4-8717-4c2a-bd9a-68a343a1a688.image-534fc5f4-33de-46f3-8f59-ec43e1853ad5790.jpg?Key-Pair-Id=APKAIHG36VEWPDULE23Q&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly91cy1lYXN0LnN0cmVhbS1pby1jZG4uY29tLzExNDM0NC9pbWFnZXMvNGQ1ODllYTQtODcxNy00YzJhLWJkOWEtNjhhMzQzYTFhNjg4LmltYWdlLTUzNGZjNWY0LTMzZGUtNDZmMy04ZjU5LWVjNDNlMTg1M2FkNTc5MC5qcGc~Km9oPTEyODAqb3c9OTYwKiIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTY3NTczMTU1Mn19fV19&Signature=Q6pitq~Opzb-~~lPSshSSFvkol2hni~Zm70Hpfw3xFMjSOoCnqu7CLLlDk8H7NI9Qq1CK8HqDKTDxfRbPTiSkHYBGTPwwC-BFMGxafxUbNngjsAvaEB9822NhthJrlnp-1RSwU~Lc7WPJ-uiuOstBt8gE1g5NVQULSSBenICq75bCX5WE363aOHUCnrrFHMX6kewJ4-suGwbKv~J7Uo2YSCG7sUEY4foMKBOP3TuajYkqlY6UNhmunCvlNQHXJMdccTUbH7v7HuOjYbmTKFzxCYWPX9BM3-eYSH07oV7T5oCU7k9ZNBjc8wf0f5lEd2Qdp58TL0OOyC6eBVvz7oO8g__&oh=1280&ow=960",
                        original_height: 1280,
                        original_width: 960,
                        type: "image",
                    }
                ],
                channel: {
                    cid: "messaging:c47d45f2-0dd9-4eaa-1600-4ff6e518199a",
                    created_at: "2022-09-30T22:49:45.59342Z",
                    disabled: false,
                    frozen: false,
                    id: "c47d45f2-0dd9-4eaa-1600-4ff6e518199a",
                    last_message_at: "2023-01-24T01:00:59.432027Z",
                    member_count: 4,
                    name: "Test group baru",
                    type: "messaging",
updated_at: "2023-01-24T01:41:46.237211Z"
                }
            }
        }
    ]



    const mockParticipans = {
        'a3c59170-c110-4fac-929e-7834f6c6827f': {
            banned: false,
            channel_role: "channel_moderator",
            created_at: "2022-09-30T22:49:45.911054Z",
            is_moderator: true,
            role: "admin",
            shadow_banned: false,
            updated_at: "2022-09-30T22:49:45.911054Z",
            user: {
                banned: false,
                created_at: "2021-11-29T05:40:40.828927Z",
                id: "a3c59170-c110-4fac-929e-7834f6c6827f",
                image: "https://res.cloudinary.com/hpjivutj2/image/upload/v1666664085/vcinqpjniuigf6mdnmzz.jpg",
                last_active: "2021-12-06T03:54:03.677683Z",
                name: "BetterSocial_Team",
                online: false,
                role: "admin",
                updated_at: "2022-11-02T15:30:30.170297Z"
            },
            user_id: "a3c59170-c110-4fac-929e-7834f6c6827f"
        },
         'b3c59170-c110-4fac-929e-7834f6c6827d': {
            banned: false,
            channel_role: "channel_moderator",
            created_at: "2022-09-30T22:49:45.911054Z",
            is_moderator: true,
            role: "admin",
            shadow_banned: false,
            updated_at: "2022-09-30T22:49:45.911054Z",
            user: {
                banned: false,
                created_at: "2021-11-29T05:40:40.828927Z",
                id: "a3c59170-c110-4fac-929e-7834f6c6827f",
                image: "https://res.cloudinary.com/hpjivutj2/image/upload/v1666664085/vcinqpjniuigf6mdnmzz.jpg",
                last_active: "2021-12-06T03:54:03.677683Z",
                name: "BetterSocial_Team",
                online: false,
                role: "admin",
                updated_at: "2022-11-02T15:30:30.170297Z"
            },
            user_id: "b3c59170-c110-4fac-929e-7834f6c6827d"
        },
    }
    const mockQueryMember = jest.fn().mockImplementation(() => ({members: [{ banned: false,
            channel_role: "channel_moderator",
            created_at: "2022-09-30T22:49:45.911054Z",
            is_moderator: true,
            role: "admin",
            shadow_banned: false,
            updated_at: "2022-09-30T22:49:45.911054Z",
            user: {
                banned: false,
                created_at: "2021-11-29T05:40:40.828927Z",
                id: "a3c59170-c110-4fac-929e-7834f6c6827f",
                image: "https://res.cloudinary.com/hpjivutj2/image/upload/v1666664085/vcinqpjniuigf6mdnmzz.jpg",
                last_active: "2021-12-06T03:54:03.677683Z",
                name: "BetterSocial_Team",
                online: false,
                role: "admin",
                updated_at: "2022-11-02T15:30:30.170297Z"
            },
            user_id: "a3c59170-c110-4fac-929e-7834f6c6827f"}]}))
    
        const mockChannel = {
        cid: "messaging:c47d45f2-0dd9-4eaa-1600-4ff6e518199a",
        data: {
            cid: "messaging:c47d45f2-0dd9-4eaa-1600-4ff6e518199a",
            created_at: "2022-09-30T22:49:45.59342Z",
            createdBy: {
                banned: false,
                created_at: "2022-06-10T13:11:53.396427Z",
                id: "c6c91b04-795c-404e-b012-ea28813a2006",
                image: "https://res.cloudinary.com/hpjivutj2/image/upload/v1659099243/pbdv3jlyd4mhmtis6kqx.jpg",
                last_active: "2022-06-10T13:11:58.020555Z",
                name: "Agita",
                online: false,
                role: "user",
                updated_at: "2023-01-24T01:41:19.021868Z",
            },
            disabled: false,
            frozen: false,
            hidden: false,
            id: "c47d45f2-0dd9-4eaa-1600-4ff6e518199a",
            last_message_at: "2023-01-24T01:00:59.432027Z",
            member_count: 4,
            name: "Test group baru",
            type: "messaging",
            updated_at: "2023-01-24T01:41:46.237211Z"
        },
        disconnected: false,
        id: "c47d45f2-0dd9-4eaa-1600-4ff6e518199a",
        initialized: true,
        isTyping: false,
        lastKeyStroke: undefined,
        lastTypingEvent: null,
        queryMembers: mockQueryMember
    }

    it('handleOnNameChange should run correctly', () => {
        const navigation = {
            push: jest.fn()
        }
        const wrapper = ({children}) => (
            <Context.Provider value={{profile: [{isShowHeader: true, myProfile: mockMyProfile,  navbarTitle: "Who you're following"}], groupChat: [{asset: mockAsset, participants: mockParticipans}], channel: [{channel: mockChannel}]}} >
                {children}
            </Context.Provider>
        )
        const {result} = renderHook(() => useGroupInfo({navigation}), {wrapper})
        act(() => {
            result.current.handleOnNameChange()
        })

        expect(navigation.push).toHaveBeenCalled()
    })

    it('onProfilePressed should run correctly', () => {
         const navigation = {
            push: jest.fn(),
            navigate: jest.fn()
        }
        const wrapper = ({children}) => (
            <Context.Provider value={{profile: [{isShowHeader: true, myProfile: mockMyProfile,  navbarTitle: "Who you're following"}], groupChat: [{asset: mockAsset, participants: mockParticipans}], channel: [{channel: mockChannel}]}} >
                {children}
            </Context.Provider>
        )
        const {result} = renderHook(() => useGroupInfo({navigation}), {wrapper})
        act(() => {
            result.current.onProfilePressed('a3c59170-c110-4fac-929e-7834f6c6827f')
        })
        expect(navigation.navigate).toHaveBeenCalled()
        act(() => {
            result.current.onProfilePressed('b3c59170-c110-4fac-929e-7834f6c6827d')
        })
        expect(navigation.navigate).toHaveBeenCalled()
    })

    it('serializeMembersList should run correctly', () => {
          const navigation = {
            push: jest.fn(),
            navigate: jest.fn()
        }
        const wrapper = ({children}) => (
            <Context.Provider value={{profile: [{isShowHeader: true, myProfile: mockMyProfile,  navbarTitle: "Who you're following"}], groupChat: [{asset: mockAsset, participants: mockParticipans}], channel: [{channel: mockChannel}]}} >
                {children}
            </Context.Provider>
        )
        const {result} = renderHook(() => useGroupInfo({navigation}), {wrapper})
        expect(result.current.serializeMembersList([{user_id: '123', name: 'agita', address: 'anoa'}])).toEqual({'123': {user_id: '123', name: 'agita', address: 'anoa'}})
        expect(result.current.serializeMembersList([])).toEqual({})
        expect(result.current.serializeMembersList()).toEqual({})
    })

    it('getMembersList should run correctly', async () => {
           const navigation = {
            push: jest.fn(),
            navigate: jest.fn()
        }
        const spySetParticipant = jest.spyOn(groupChatService, 'setParticipants')

        const wrapper = ({children}) => (
            <Context.Provider value={{profile: [{isShowHeader: true, myProfile: mockMyProfile,  navbarTitle: "Who you're following"}], groupChat: [{asset: mockAsset, participants: mockParticipans}], channel: [{channel: mockChannel}]}} >
                {children}
            </Context.Provider>
        )
        const {result} = renderHook(() => useGroupInfo({navigation}), {wrapper})
        await result.current.getMembersList()
        expect(mockQueryMember).toHaveBeenCalled()
        expect(spySetParticipant).toHaveBeenCalled()
        expect(result.current.isLoadingMembers).toBeFalsy()

    })

    it('handleOnNameChange should run correctly', () => {
           const navigation = {
            push: jest.fn(),
            navigate: jest.fn()
        }
        const wrapper = ({children}) => (
            <Context.Provider value={{profile: [{isShowHeader: true, myProfile: mockMyProfile,  navbarTitle: "Who you're following"}], groupChat: [{asset: mockAsset, participants: mockParticipans}], channel: [{channel: mockChannel}]}} >
                {children}
            </Context.Provider>
        )
        const {result} = renderHook(() => useGroupInfo({navigation}), {wrapper})
        act(() => {
            result.current.handleOnNameChange()
        })
        expect(navigation.push).toHaveBeenCalled()
    })
    

    it('handleOnImageClicked should run correctly', async () => {
          const navigation = {
            push: jest.fn(),
            navigate: jest.fn()
        }
        const spyPermission = jest.spyOn(servicePermission, 'requestExternalStoragePermission')
        const spyGallery = jest.spyOn(launchGallery, 'launchImageLibrary')
        const wrapper = ({children}) => (
            <Context.Provider value={{profile: [{isShowHeader: true, myProfile: mockMyProfile,  navbarTitle: "Who you're following"}], groupChat: [{asset: mockAsset, participants: mockParticipans}], channel: [{channel: mockChannel}]}} >
                {children}
            </Context.Provider>
        )
        const {result} = renderHook(() => useGroupInfo({navigation}), {wrapper})
        await result.current.handleOnImageClicked()
        expect(spyPermission).toHaveBeenCalled()
        expect(spyGallery).toHaveBeenCalled()
    })

    it('uploadImageBase64 should run correctly', async () => {
          const navigation = {
            push: jest.fn(),
            navigate: jest.fn()
        }
        const spyService = jest.spyOn(serviceFile, 'uploadFile')
        const wrapper = ({children}) => (
            <Context.Provider value={{profile: [{isShowHeader: true, myProfile: mockMyProfile,  navbarTitle: "Who you're following"}], groupChat: [{asset: mockAsset, participants: mockParticipans}], channel: [{channel: mockChannel}]}} >
                {children}
            </Context.Provider>
        )
        const {result} = renderHook(() => useGroupInfo({navigation}), {wrapper})
        await result.current.uploadImageBase64({base64: '1234'})
        expect(result.current.isUploadingImage).toBeTruthy()
        expect(spyService).toHaveBeenCalled()
        expect(result.current.uploadedImage).toEqual('https://detik.jpg')
    })
})