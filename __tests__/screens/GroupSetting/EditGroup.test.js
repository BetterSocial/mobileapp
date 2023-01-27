import React from 'react'
import GroupSetting from "../../../src/screens/GroupSetting/elements/EditGroup"
import {render, cleanup, act, fireEvent} from '@testing-library/react-native'
import { Context } from '../../../src/context'

describe('EditGroup should run correctly', () => {
    const mockContext = {
            groupChat: [
                {asset: [
                    {message: {
                                    cid: "messaging:c47d45f2-0dd9-4eaa-1600-4ff6e518199a",
                                    created_at: "2023-01-24T00:59:12.801526Z",
                                    html: "",
                                    id: "c6c91b04-795c-404e-b012-ea28813a2006-531b41e6-263b-4d6c-1c0e-e62f13357aef",
                                    latest_reactions: [],
                                    mentioned_users: [],
                                    attachments: null,
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
                    }}
                ],
                participants: {
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
                        'b3c59170-c110-4fac-929e-7834f6c6827e': {
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
                        user_id: "b3c59170-c110-4fac-929e-7834f6c6827e"
                    },
                    'bc3c59170-c110-4fac-929e-7834f6c6827l': {
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
                        user_id: "bc3c59170-c110-4fac-929e-7834f6c6827l"
                    },
                    
                }
            }
            ],
            channel: [
                {channel: {
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
                    updated_at: "2023-01-24T01:41:46.237211Z",
                    image: 'https://image.jpg'
                    },
                    disconnected: false,
                    id: "c47d45f2-0dd9-4eaa-1600-4ff6e518199a",
                    initialized: true,
                    isTyping: false,
                    lastKeyStroke: undefined,
                    lastTypingEvent: null,
                        },
                    profileChannel: null
                    }
            ],
            profile: [
                {myProfile: {
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
                }}
            ]
        }
        const mockFocus = jest.fn()
        beforeEach(() => {
            jest.spyOn(React, 'useRef').mockImplementation(() => ({current: {focus: mockFocus}}))
        })

        it('editGroup should match snapshot', () => {
            const wrapper = ({children}) => (
            <Context.Provider value={mockContext} >
                {children}
            </Context.Provider>
            )
            const onUpdateImage = jest.fn()
            const saveGroupName = jest.fn()
            const updateName = jest.fn()
            const {toJSON} = render(<GroupSetting imageUri={'https://imag.jpg'} onUpdateImage={onUpdateImage} setEditName={updateName} editName={'general'} isFocusChatName={'test'} saveGroupName={saveGroupName} />, {wrapper})
            expect(toJSON).toMatchSnapshot()
        })

        it('updateImage should run correctly', () => {
             const wrapper = ({children}) => (
            <Context.Provider value={mockContext} >
                {children}
            </Context.Provider>
            )
            const onUpdateImage = jest.fn()
            const saveGroupName = jest.fn()
            const updateName = jest.fn()
            const {getByTestId} = render(<GroupSetting imageUri={'https://imag.jpg'} onUpdateImage={onUpdateImage} setEditName={updateName} editName={'general'} isFocusChatName={'test'} saveGroupName={saveGroupName} />, {wrapper})
            act(() => {
                fireEvent.press(getByTestId('updateImage'))
            })
            expect(onUpdateImage).toHaveBeenCalled()
        })

        it('image type file:/// should show correctly', () => {
               const wrapper = ({children}) => (
            <Context.Provider value={mockContext} >
                {children}
            </Context.Provider>
            )
            const onUpdateImage = jest.fn()
            const saveGroupName = jest.fn()
            const updateName = jest.fn()
            const {getAllByTestId} = render(<GroupSetting imageUri={'file:///imag.jpg'} onUpdateImage={onUpdateImage} setEditName={updateName} editName={'general'} isFocusChatName={'test'} saveGroupName={saveGroupName} />, {wrapper})
            expect(getAllByTestId('fileImage')).toHaveLength(1)
        })
         

            it('image type res.cloudinary.com should show correctly', () => {
               const wrapper = ({children}) => (
            <Context.Provider value={mockContext} >
                {children}
            </Context.Provider>
            )
            const onUpdateImage = jest.fn()
            const saveGroupName = jest.fn()
            const updateName = jest.fn()
            const {getAllByTestId} = render(<GroupSetting imageUri={'res.cloudinary.com'} onUpdateImage={onUpdateImage} setEditName={updateName} editName={'general'} isFocusChatName={'test'} saveGroupName={saveGroupName} />, {wrapper})
            expect(getAllByTestId('rescloud')).toHaveLength(1)
        })

        it('image count user > 2 should be correct', () => {
            const wrapper = ({children}) => (
            <Context.Provider value={mockContext} >
                {children}
            </Context.Provider>
            )
            const onUpdateImage = jest.fn()
            const saveGroupName = jest.fn()
            const updateName = jest.fn()
            const {getAllByTestId} = render(<GroupSetting imageUri={''} onUpdateImage={onUpdateImage} setEditName={updateName} editName={'general'} isFocusChatName={'test'} saveGroupName={saveGroupName} />, {wrapper})
            expect(getAllByTestId('imageCountUser')).toHaveLength(1)
        })
        
    
})