import React from 'react';
import {render} from '@testing-library/react-native';

import PreviewComment, {styles} from '../../../src/components/PreviewComment';
import {COLORS, SIZES} from '../../../src/utils/theme';

describe('Preview comment should run correctly', () => {
  const mockItem = {
    data: {
      anon_user_info_emoji_name: 'test',
      is_anonymous: true,
      anon_user_info_color_code: 'red',
      anon_user_info_emoji_code: 'deer'
    },
    activity_id: '4857b41f-4e4f-11ee-bea4-0a319bc15cb3',
    children_counts: {},
    created_at: '2023-09-08T15:06:37.484527Z',
    id: 'd7224f22-55da-409f-82ae-628f47274316',
    kind: 'comment',
    latest_children: {},
    parent: '',
    target_feeds: [
      'notification:be0955ad-8256-4940-8890-6ac6d4f9aafa',
      'notification:0188bba3-4def-404b-876d-ecd542149389'
    ],
    updated_at: '2023-09-08T15:06:37.484527Z',
    user: {
      created_at: '2023-05-10T08:15:21.108731Z',
      id: '0188bba3-4def-404b-876d-ecd542149389',
      updated_at: '2023-05-11T09:17:21.337209Z'
    },
    user_id: '0188bba3-4def-404b-876d-ecd542149389'
  };
  const user = {
    created_at: '2023-05-10T08:15:21.108731Z',
    data: {
      profile_pic_url:
        'https://res.cloudinary.com/hpjivutj2/image/upload/v1680929851/default-profile-picture_vrmmdn.png',
      username: 'Agita'
    },
    id: '0188bba3-4def-404b-876d-ecd542149389',
    updated_at: '2023-05-11T09:17:21.337209Z'
  };
  it('should match with snapshot', () => {
    const {toJSON} = render(
      <PreviewComment
        comment={'kus'}
        image={
          'https://res.cloudinary.com/hpjivutj2/image/upload/v1680929851/default-profile-picture_vrmmdn.png'
        }
        item={mockItem}
        time={'2023-09-08T15:06:37.484527Z'}
        totalComment={0}
        user={user}
      />
    );
    expect(toJSON).toMatchSnapshot();
  });
});
