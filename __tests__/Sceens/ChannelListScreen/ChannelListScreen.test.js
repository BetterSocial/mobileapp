
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import ChannelListComponent from '../../../src/screens/ChannelListScreen'
import {Context} from '../../../src/context'
import StreamChat from 'stream-chat-react-native';
jest.mock('stream-chat-react-native', () => ({
    Chat: jest.fn(),
    ChannelList: jest.fn()
}))
jest.mock('stream-chat-react-native-core', () => jest.fn())
jest.mock('react-native-share', () => ({
    FACEBOOK: jest.fn()
}))
jest.mock('react-native-redash', () => jest.fn());

describe('screen channel should same as snapshot', () => {
    const valueContext = {profile: [{profile: {
        "bio": "Fe mobile engineer",
        "country_code": "ID",
        "createdAt": "2022-06-10T13:11:53.000Z",
        "follower": 13,
        "follower_symbol": "< 25",
        "following": 2,
        "following_symbol": "< 25",
        "human_id": "I4K3M10FGR78EWQQDNQ2",
        "last_active_at": "2022-06-10T13:11:53.000Z",
        "locations": [
            {
            "city": "Yauco, PR",
            "country": "US",
            "createdAt": "2022-05-30T14:15:24.000Z",
            "location_id": "45",
            "location_level": "City",
            "neighborhood": "",
            "slug_name": "",
            "state": "Puerto Rico",
            "status": "Y",
            "updatedAt": "2022-05-30T14:15:24.000Z",
            "zip": ""
            }
        ],
        "profile_pic_asset_id": "6f47f70bea98469f4a24b6ffc550c983",
        "profile_pic_path": "https://res.cloudinary.com/hpjivutj2/image/upload/v1659099243/pbdv3jlyd4mhmtis6kqx.jpg",
        "profile_pic_public_id": "pbdv3jlyd4mhmtis6kqx",
        "real_name": null,
        "status": "Y",
        "updatedAt": "2022-07-29T12:54:04.000Z",
        "user_id": "c6c91b04-795c-404e-b012-ea28813a2006",
        "username": "Agita"
    }, myProfile: {
        "bio": "Fe mobile engineer",
        "country_code": "ID",
        "createdAt": "2022-06-10T13:11:53.000Z",
        "follower": 13,
        "follower_symbol": "< 25",
        "following": 2,
        "following_symbol": "< 25",
        "human_id": "I4K3M10FGR78EWQQDNQ2",
        "last_active_at": "2022-06-10T13:11:53.000Z",
        "locations": [
            {
            "city": "Yauco, PR",
            "country": "US",
            "createdAt": "2022-05-30T14:15:24.000Z",
            "location_id": "45",
            "location_level": "City",
            "neighborhood": "",
            "slug_name": "",
            "state": "Puerto Rico",
            "status": "Y",
            "updatedAt": "2022-05-30T14:15:24.000Z",
            "zip": ""
            }
        ],
        "profile_pic_asset_id": "6f47f70bea98469f4a24b6ffc550c983",
        "profile_pic_path": "https://res.cloudinary.com/hpjivutj2/image/upload/v1659099243/pbdv3jlyd4mhmtis6kqx.jpg",
        "profile_pic_public_id": "pbdv3jlyd4mhmtis6kqx",
        "real_name": null,
        "status": "Y",
        "updatedAt": "2022-07-29T12:54:04.000Z",
        "user_id": "c6c91b04-795c-404e-b012-ea28813a2006",
        "username": "Agita"
    }}], 
    client: [{client: jest.fn()}],
    channel: [],
    feeds: [],
    unReadMessage: [{unReadMessage: 0, dispatchUnreadMessage: jest.fn()}, jest.fn()]
}
    const wrapper = ({children}) => (
        <Context.Provider value={valueContext}  >
            {children}
        </Context.Provider>
    )

    it('code should not change', () => {
        jest.spyOn(React, 'useRef').mockResolvedValueOnce({current: {focus: jest.fn()}})
        render(<ChannelListComponent />, {wrapper}) 
        expect(screen.toJSON()).toMatchSnapshot()       
    })

    it('channel list should be on the documnet', async () => {
        jest.spyOn(React, 'useRef').mockResolvedValueOnce({current: {focus: jest.fn()}})
        jest.spyOn(StreamChat, 'Chat')
        // jest.spyOn(ChatStream, 'Streami18n')
        const {rerender, debug, getAllByTestId} = render(<ChannelListComponent />, {wrapper})
        rerender(<ChannelListComponent />, {wrapper})
        // console.log(getAllByTestId('chat-container'),'mimi')
        //   await waitFor(() =>screen.getAllByTestId('chat-container'));
        // expect(screen.getByTestId('chat-container')).toBeDefined()
        debug.shallow('test debug')
        // console.log(screen.getAllByTestId('chat-container'), 'kamar')
        // expect(sc)
    })
})