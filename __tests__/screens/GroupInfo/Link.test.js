import React from 'react'
import {render} from '@testing-library/react-native'
import Link from '../../../src/screens/GroupInfo/elements/Link'
import { Context } from '../../../src/context';

const mockGoback = jest.fn()

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ goBack: mockGoback}),
}));

describe('it Link groupInfo should run correctly', () => {

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
                        author_name: 'agita',
                        title_link: 'test 1',
                        title: 'test 123'
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
    it('Link should match snapshot', () => {
         const wrapper = ({children}) => (
            <Context.Provider value={{groupChat: [{asset: mockAsset, participants: mockParticipans}]}} >
                {children}
            </Context.Provider>
        )
        const {toJSON, getAllByTestId} = render(<Link  />, {wrapper})
        expect(toJSON).toMatchSnapshot()
        expect(getAllByTestId('onPress')).toHaveLength(mockAsset.length)
    })

})