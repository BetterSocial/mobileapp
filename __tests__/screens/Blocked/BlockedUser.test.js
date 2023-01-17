import React from 'react'
import {render} from '@testing-library/react-native'
import BlockedUser from "../../../src/screens/Blocked/elements/UserScreen"
import BlockedList from "../../../src/screens/Blocked/elements/RenderList"

describe('Block user should run correctly', () => {
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
    it('should match snapshot', () => {
        const navigation = {
            navigate: jest.fn(),
            setOptions: jest.fn()
        }
        const {toJSON} = render(<BlockedUser navigation={navigation} />)
        expect(toJSON).toMatchSnapshot()
    })

    // it('onPressBody should move to detail user', () => {
    //     const onPressBody = jest.fn()
    //     const onPressList = jest.fn()

    //     const {} = render(<BlockedList onPressBody={onPressBody} onPressList={onPressList} />)
    // })
})