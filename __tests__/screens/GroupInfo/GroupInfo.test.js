import React from 'react';
import {Image} from 'react-native';
import {act, fireEvent, render} from '@testing-library/react-native';

import * as useGroupInfo from '../../../src/screens/GroupInfo/hooks/useGroupInfo';
import GroupInfo, {styles} from '../../../src/screens/GroupInfo';
import {Context} from '../../../src/context/Store';
import {myProfileMock} from '../../../__mocks__/mockMyProfile';

jest.mock('react-native-permissions', () => require('react-native-permissions/mock'));

const mockAddListener = jest.fn();
const mockGoback = jest.fn();
const mockNavigate = jest.fn();
const mockPush = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    goBack: mockGoback,
    addListener: mockAddListener,
    navigate: mockNavigate,
    push: mockPush
  }),
  useRoute: () => ({
    params: {
      from: 'AddParticipant'
    }
  })
}));

jest.mock('stream-chat-react-native-core', () => ({
  generateRandomId: jest.fn(() => 'random-id')
}));

describe('GroupInfo should run correctly', () => {
  const mockMyProfile = myProfileMock;

  const mockAsset = [
    {
      message: {
        cid: 'messaging:c47d45f2-0dd9-4eaa-1600-4ff6e518199a',
        created_at: '2023-01-24T00:59:12.801526Z',
        html: '',
        id: 'c6c91b04-795c-404e-b012-ea28813a2006-531b41e6-263b-4d6c-1c0e-e62f13357aef',
        latest_reactions: [],
        mentioned_users: [],
        attachments: [
          {
            image_url:
              'https://us-east.stream-io-cdn.com/114344/images/4d589ea4-8717-4c2a-bd9a-68a343a1a688.image-534fc5f4-33de-46f3-8f59-ec43e1853ad5790.jpg?Key-Pair-Id=APKAIHG36VEWPDULE23Q&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly91cy1lYXN0LnN0cmVhbS1pby1jZG4uY29tLzExNDM0NC9pbWFnZXMvNGQ1ODllYTQtODcxNy00YzJhLWJkOWEtNjhhMzQzYTFhNjg4LmltYWdlLTUzNGZjNWY0LTMzZGUtNDZmMy04ZjU5LWVjNDNlMTg1M2FkNTc5MC5qcGc~Km9oPTEyODAqb3c9OTYwKiIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTY3NTczMTU1Mn19fV19&Signature=Q6pitq~Opzb-~~lPSshSSFvkol2hni~Zm70Hpfw3xFMjSOoCnqu7CLLlDk8H7NI9Qq1CK8HqDKTDxfRbPTiSkHYBGTPwwC-BFMGxafxUbNngjsAvaEB9822NhthJrlnp-1RSwU~Lc7WPJ-uiuOstBt8gE1g5NVQULSSBenICq75bCX5WE363aOHUCnrrFHMX6kewJ4-suGwbKv~J7Uo2YSCG7sUEY4foMKBOP3TuajYkqlY6UNhmunCvlNQHXJMdccTUbH7v7HuOjYbmTKFzxCYWPX9BM3-eYSH07oV7T5oCU7k9ZNBjc8wf0f5lEd2Qdp58TL0OOyC6eBVvz7oO8g__&oh=1280&ow=960',
            original_height: 1280,
            original_width: 960,
            type: 'image'
          }
        ],
        channel: {
          cid: 'messaging:c47d45f2-0dd9-4eaa-1600-4ff6e518199a',
          created_at: '2022-09-30T22:49:45.59342Z',
          disabled: false,
          frozen: false,
          id: 'c47d45f2-0dd9-4eaa-1600-4ff6e518199a',
          last_message_at: '2023-01-24T01:00:59.432027Z',
          member_count: 4,
          name: 'Test group baru',
          type: 'messaging',
          updated_at: '2023-01-24T01:41:46.237211Z'
        }
      }
    }
  ];

  const mockAsset1 = [
    {
      message: {
        cid: 'messaging:c47d45f2-0dd9-4eaa-1600-4ff6e518199a',
        created_at: '2023-01-24T00:59:12.801526Z',
        html: '',
        id: 'c6c91b04-795c-404e-b012-ea28813a2006-531b41e6-263b-4d6c-1c0e-e62f13357aef',
        latest_reactions: [],
        mentioned_users: [],
        attachments: null,
        channel: {
          cid: 'messaging:c47d45f2-0dd9-4eaa-1600-4ff6e518199a',
          created_at: '2022-09-30T22:49:45.59342Z',
          disabled: false,
          frozen: false,
          id: 'c47d45f2-0dd9-4eaa-1600-4ff6e518199a',
          last_message_at: '2023-01-24T01:00:59.432027Z',
          member_count: 4,
          name: 'Test group baru',
          type: 'messaging',
          updated_at: '2023-01-24T01:41:46.237211Z'
        }
      }
    }
  ];

  const mockParticipans = {
    'a3c59170-c110-4fac-929e-7834f6c6827f': {
      banned: false,
      channel_role: 'channel_moderator',
      created_at: '2022-09-30T22:49:45.911054Z',
      is_moderator: true,
      role: 'admin',
      shadow_banned: false,
      updated_at: '2022-09-30T22:49:45.911054Z',
      user: {
        banned: false,
        created_at: '2021-11-29T05:40:40.828927Z',
        id: 'a3c59170-c110-4fac-929e-7834f6c6827f',
        image:
          'https://res.cloudinary.com/hpjivutj2/image/upload/v1666664085/vcinqpjniuigf6mdnmzz.jpg',
        last_active: '2021-12-06T03:54:03.677683Z',
        name: 'BetterSocial_Team',
        online: false,
        role: 'admin',
        updated_at: '2022-11-02T15:30:30.170297Z'
      },
      user_id: 'a3c59170-c110-4fac-929e-7834f6c6827f'
    },
    'b3c59170-c110-4fac-929e-7834f6c6827d': {
      banned: false,
      channel_role: 'channel_moderator',
      created_at: '2022-09-30T22:49:45.911054Z',
      is_moderator: true,
      role: 'admin',
      shadow_banned: false,
      updated_at: '2022-09-30T22:49:45.911054Z',
      user: {
        banned: false,
        created_at: '2021-11-29T05:40:40.828927Z',
        id: 'a3c59170-c110-4fac-929e-7834f6c6827f',
        image:
          'https://res.cloudinary.com/hpjivutj2/image/upload/v1666664085/vcinqpjniuigf6mdnmzz.jpg',
        last_active: '2021-12-06T03:54:03.677683Z',
        name: 'BetterSocial_Team',
        online: false,
        role: 'admin',
        updated_at: '2022-11-02T15:30:30.170297Z'
      },
      user_id: 'b3c59170-c110-4fac-929e-7834f6c6827d'
    }
  };
  const mockQueryMember = jest.fn().mockImplementation(() => ({
    members: [
      {
        banned: false,
        channel_role: 'channel_moderator',
        created_at: '2022-09-30T22:49:45.911054Z',
        is_moderator: true,
        role: 'admin',
        shadow_banned: false,
        updated_at: '2022-09-30T22:49:45.911054Z',
        user: {
          banned: false,
          created_at: '2021-11-29T05:40:40.828927Z',
          id: 'a3c59170-c110-4fac-929e-7834f6c6827f',
          image:
            'https://res.cloudinary.com/hpjivutj2/image/upload/v1666664085/vcinqpjniuigf6mdnmzz.jpg',
          last_active: '2021-12-06T03:54:03.677683Z',
          name: 'BetterSocial_Team',
          online: false,
          role: 'admin',
          updated_at: '2022-11-02T15:30:30.170297Z'
        },
        user_id: 'a3c59170-c110-4fac-929e-7834f6c6827f'
      }
    ]
  }));

  const mockChannel = {
    cid: 'messaging:c47d45f2-0dd9-4eaa-1600-4ff6e518199a',
    data: {
      cid: 'messaging:c47d45f2-0dd9-4eaa-1600-4ff6e518199a',
      created_at: '2022-09-30T22:49:45.59342Z',
      createdBy: {
        banned: false,
        created_at: '2022-06-10T13:11:53.396427Z',
        id: 'c6c91b04-795c-404e-b012-ea28813a2006',
        image:
          'https://res.cloudinary.com/hpjivutj2/image/upload/v1659099243/pbdv3jlyd4mhmtis6kqx.jpg',
        last_active: '2022-06-10T13:11:58.020555Z',
        name: 'Agita',
        online: false,
        role: 'user',
        updated_at: '2023-01-24T01:41:19.021868Z'
      },
      disabled: false,
      frozen: false,
      hidden: false,
      id: 'c47d45f2-0dd9-4eaa-1600-4ff6e518199a',
      last_message_at: '2023-01-24T01:00:59.432027Z',
      member_count: 4,
      name: 'Test group baru',
      type: 'messaging',
      updated_at: '2023-01-24T01:41:46.237211Z',
      image: 'https://image.jpg'
    },
    disconnected: false,
    id: 'c47d45f2-0dd9-4eaa-1600-4ff6e518199a',
    initialized: true,
    isTyping: false,
    lastKeyStroke: undefined,
    lastTypingEvent: null,
    queryMembers: mockQueryMember
  };

  const setIsLoadingMembers = jest.fn();
  const mockImageClick = jest.fn();
  beforeEach(() => {
    jest.spyOn(useGroupInfo, 'default').mockImplementation(() => ({
      setIsLoadingMembers,
      handleOnImageClicked: mockImageClick,
      isLoadingMembers: false,
      members: [],
      channel: mockChannel,
      isShowHeader: true,
      myProfile: mockMyProfile,
      navbarTitle: "Who you're following",
      asset: mockAsset,
      participants: mockParticipans,
      profileChannel: {},
      uploadedImage: '',
      isUploadingImage: false,
      createChat: '2023-01-24T01:41:46.237211Z',
      getMembersList: jest.fn(),
      chatName: '',
      handleOnNameChange: jest.fn(),
      newParticipant: [],
      selectedUser: [],
      handleCloseSelectUser: jest.fn(),
      openModal: false,
      alertRemoveUser: jest.fn(),
      memberName: jest.fn(() => ''),
      onLeaveGroup: jest.fn(),
      profile: '',
      setUsername: jest.fn(),
      channelState: {
        channel: {
          data: {
            type: 'group'
          }
        }
      }
    }));
  });
  const wrapper = ({children}) => (
    <Context.Provider
      value={{
        profile: [
          {isShowHeader: true, myProfile: mockMyProfile, navbarTitle: "Who you're following"}
        ],
        groupChat: [{asset: mockAsset, participants: mockParticipans}],
        channel: [{channel: mockChannel}]
      }}>
      {children}
    </Context.Provider>
  );

  it('GroupInfo should match snapshot', () => {
    const {toJSON} = render(<GroupInfo />, {wrapper});
    expect(toJSON()).toMatchSnapshot();
    expect(mockAddListener).toHaveBeenCalled();
    // expect(setIsLoadingMembers).toHaveBeenCalled()
  });

  it('image style should run correct', () => {
    expect(styles.image(true)).toEqual({
      width: 80,
      height: 80,
      marginLeft: 0
    });
    expect(styles.image(false)).toEqual({
      width: 80,
      height: 80,
      marginLeft: 5
    });
  });

  it('imageClick should run correctly', () => {
    const {getByTestId} = render(<GroupInfo />, {wrapper});
    act(() => {
      fireEvent.press(getByTestId('imageClick'));
    });
    expect(mockImageClick).toHaveBeenCalled();
  });

  it('backButton should run correctly', () => {
    const {getByTestId} = render(<GroupInfo />, {wrapper});
    act(() => {
      fireEvent.press(getByTestId('backButton'));
    });
    expect(mockGoback).toHaveBeenCalled();
  });

  it('groupMedia should run correctly', () => {
    const {getByTestId} = render(<GroupInfo />, {wrapper});
    act(() => {
      fireEvent.press(getByTestId('groupMedia'));
    });
    expect(mockNavigate).toHaveBeenCalled();
  });

  it('flatlist asset should run correctly', () => {
    const {getByTestId} = render(<GroupInfo />, {wrapper});
    expect(getByTestId('asset').props.keyExtractor(mockAsset[0], 1)).toEqual('1');
    expect(getByTestId('asset').props.renderItem({item: mockAsset1[0]})).toEqual(null);
    expect(getByTestId('asset').props.renderItem({item: mockAsset[0]})).toEqual(
      <Image
        height={80}
        source={{
          uri: 'https://us-east.stream-io-cdn.com/114344/images/4d589ea4-8717-4c2a-bd9a-68a343a1a688.image-534fc5f4-33de-46f3-8f59-ec43e1853ad5790.jpg?Key-Pair-Id=APKAIHG36VEWPDULE23Q&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly91cy1lYXN0LnN0cmVhbS1pby1jZG4uY29tLzExNDM0NC9pbWFnZXMvNGQ1ODllYTQtODcxNy00YzJhLWJkOWEtNjhhMzQzYTFhNjg4LmltYWdlLTUzNGZjNWY0LTMzZGUtNDZmMy04ZjU5LWVjNDNlMTg1M2FkNTc5MC5qcGc~Km9oPTEyODAqb3c9OTYwKiIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTY3NTczMTU1Mn19fV19&Signature=Q6pitq~Opzb-~~lPSshSSFvkol2hni~Zm70Hpfw3xFMjSOoCnqu7CLLlDk8H7NI9Qq1CK8HqDKTDxfRbPTiSkHYBGTPwwC-BFMGxafxUbNngjsAvaEB9822NhthJrlnp-1RSwU~Lc7WPJ-uiuOstBt8gE1g5NVQULSSBenICq75bCX5WE363aOHUCnrrFHMX6kewJ4-suGwbKv~J7Uo2YSCG7sUEY4foMKBOP3TuajYkqlY6UNhmunCvlNQHXJMdccTUbH7v7HuOjYbmTKFzxCYWPX9BM3-eYSH07oV7T5oCU7k9ZNBjc8wf0f5lEd2Qdp58TL0OOyC6eBVvz7oO8g__&oh=1280&ow=960'
        }}
        style={{height: 80, marginLeft: 5, width: 80}}
        width={80}
        testID="renderItem"
      />
    );
  });

  it('flatlist participants should run correctly', () => {
    const {getByTestId} = render(<GroupInfo />, {wrapper});
    expect(getByTestId('participants').props.keyExtractor(mockParticipans, 1)).toEqual('1');
  });

  it('addParticipant should run correctly', () => {
    const {getByTestId} = render(<GroupInfo />, {wrapper});
    act(() => {
      fireEvent.press(getByTestId('addParticipant'));
    });
    expect(mockPush).toHaveBeenCalled();
  });
});
