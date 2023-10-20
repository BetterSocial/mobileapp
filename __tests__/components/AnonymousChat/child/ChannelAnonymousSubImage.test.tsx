import * as React from 'react';
import {render} from '@testing-library/react-native';

import ChannelAnonymousSubImage from '../../../../src/components/AnonymousChat/child/ChannelAnonymousSubImage';

describe('TESTING ChannelAnonymousImage', () => {
  it('RENDER should match snapshot', () => {
    const {toJSON} = render(
      <ChannelAnonymousSubImage
        anonPostNotificationUserInfo={{
          anon_user_info_color_code: '#FF0000',
          anon_user_info_emoji_code: '🐘'
        }}
        imageStyle={{}}
      />
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('RENDER should render elements with correct value', () => {
    const {getByTestId, getByText} = render(
      <ChannelAnonymousSubImage
        anonPostNotificationUserInfo={{
          anon_user_info_color_code: '#FF0000',
          anon_user_info_emoji_code: '🐘'
        }}
        imageStyle={{}}
      />
    );

    expect(getByTestId('channel-anonymous-sub-image')).toBeTruthy();
    expect(getByTestId('channel-anonymous-sub-image')).toHaveStyle({backgroundColor: '#FF0000'});
    expect(getByTestId('channel-anonymous-sub-image-emoji')).toBeTruthy();
    expect(getByText('🐘')).toBeTruthy();
  });
});
