import React from 'react';
import {render, act, fireEvent} from '@testing-library/react-native';
import GroupSetting from '../../../src/screens/GroupSetting';
import {Context} from '../../../src/context';

// eslint-disable-next-line global-require
jest.mock('react-native-permissions', () => require('react-native-permissions/mock'));
jest.mock('react-native/Libraries/Pressability/usePressability');

jest.mock('../../../src/hooks/useAfterInteractions', () => ({
  useAfterInteractions: () => ({
    transitionRef: {current: {animateNextTransition: jest.fn()}},
    interactionsComplete: true
  })
}));

jest.mock('react-native-compressor', () => ({
  Image: {
    compressor: jest.fn()
  }
}));

describe('GroupSetting should be run correctly', () => {
  const cid = 'messaging:c47d45f2-0dd9-4eaa-1600-4ff6e518199a';
  const channel_created_at = '2022-09-30T22:49:45.59342Z';
  const channle_id = 'c47d45f2-0dd9-4eaa-1600-4ff6e518199a';
  const participant = 'a3c59170-c110-4fac-929e-7834f6c6827f';
  const dateCreated = '2022-09-30T22:49:45.911054Z';
  const userIdProfile = 'c6c91b04-795c-404e-b012-ea28813a2006';
  const image =
    'https://res.cloudinary.com/hpjivutj2/image/upload/v1659099243/pbdv3jlyd4mhmtis6kqx.jpg';
  const location_created_at = '2022-05-30T14:15:24.000Z';
  const name = 'Agita';
  const mockContext = {
    groupChat: [
      {
        asset: [
          {
            message: {
              cid,
              created_at: '2023-01-24T00:59:12.801526Z',
              html: '',
              id: 'c6c91b04-795c-404e-b012-ea28813a2006-531b41e6-263b-4d6c-1c0e-e62f13357aef',
              latest_reactions: [],
              mentioned_users: [],
              attachments: null,
              channel: {
                cid,
                created_at: channel_created_at,
                disabled: false,
                frozen: false,
                id: channle_id,
                last_message_at: '2023-01-24T01:00:59.432027Z',
                member_count: 4,
                name: 'Test group baru',
                type: 'messaging',
                updated_at: '2023-01-24T01:41:46.237211Z'
              }
            }
          }
        ],
        participants: {
          'a3c59170-c110-4fac-929e-7834f6c6827f': {
            banned: false,
            channel_role: 'channel_moderator',
            created_at: dateCreated,
            is_moderator: true,
            role: 'admin',
            shadow_banned: false,
            updated_at: dateCreated,
            user: {
              banned: false,
              created_at: '2021-11-29T05:40:40.828927Z',
              id: participant,
              image:
                'https://res.cloudinary.com/hpjivutj2/image/upload/v1666664085/vcinqpjniuigf6mdnmzz.jpg',
              last_active: '2021-12-06T03:54:03.677683Z',
              name: 'BetterSocial_Team',
              online: false,
              role: 'admin',
              updated_at: '2022-11-02T15:30:30.170297Z'
            },
            user_id: participant
          }
        }
      }
    ],
    channel: [
      {
        channel: {
          cid,
          data: {
            cid,
            created_at: channel_created_at,
            createdBy: {
              banned: false,
              created_at: '2022-06-10T13:11:53.396427Z',
              id: userIdProfile,
              image,
              last_active: '2022-06-10T13:11:58.020555Z',
              name: name,
              online: false,
              role: 'user',
              updated_at: '2023-01-24T01:41:19.021868Z'
            },
            disabled: false,
            frozen: false,
            hidden: false,
            id: channle_id,
            last_message_at: '2023-01-24T01:00:59.432027Z',
            member_count: 4,
            name: 'Test group baru',
            type: 'messaging',
            updated_at: '2023-01-24T01:41:46.237211Z',
            image: 'https://image.jpg'
          },
          disconnected: false,
          id: channle_id,
          initialized: true,
          isTyping: false,
          lastKeyStroke: undefined,
          lastTypingEvent: null
        },
        profileChannel: null
      }
    ],
    profile: [
      {
        myProfile: {
          bio: 'Fe mobile engineer',
          country_code: 'ID',
          createdAt: '2022-06-10T13:11:53.000Z',
          follower: 13,
          follower_symbol: '< 25',
          following: 10,
          following_symbol: '< 25',
          human_id: 'I4K3M10FGR78EWQQDNQ2',
          last_active_at: '2022-06-10T13:11:53.000Z',
          location: [
            {
              city: 'Yauco, PR',
              country: 'US',
              createdAt: location_created_at,
              location_id: '45',
              location_level: 'City',
              neighborhood: '',
              slug_name: '',
              state: 'Puerto Rico',
              status: 'Y',
              updatedAt: location_created_at
            }
          ],
          profile_pic_asset_id: '6f47f70bea98469f4a24b6ffc550c983',
          profile_pic_path: image,
          profile_pic_public_id: 'pbdv3jlyd4mhmtis6kqx',
          real_name: null,
          status: 'Y',
          updatedAt: '2022-07-29T12:54:04.000Z',
          user_id: userIdProfile,
          username: name
        }
      }
    ]
  };
  const wrapper = ({children}) => (
    <Context.Provider value={mockContext}>{children}</Context.Provider>
  );

  it('Should match snapshot', () => {
    const navigation = {
      push: jest.fn()
    };
    const route = {
      params: {
        focusChatName: 'Settings'
      }
    };

    const {toJSON} = render(<GroupSetting navigation={navigation} route={route} />, {wrapper});
    expect(toJSON()).toMatchSnapshot();
  });

  it('onPress heaeder should run correctly', () => {
    const navigation = {
      push: jest.fn(),
      goBack: jest.fn()
    };
    const route = {
      params: {
        focusChatName: 'Settings'
      }
    };

    const {getByTestId} = render(<GroupSetting navigation={navigation} route={route} />, {wrapper});
    act(() => {
      fireEvent.press(getByTestId('onPressAndroid'));
    });
    expect(navigation.goBack).toHaveBeenCalled();
  });
});
