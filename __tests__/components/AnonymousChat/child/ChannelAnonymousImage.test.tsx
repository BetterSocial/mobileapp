import * as React from 'react';
import {render} from '@testing-library/react-native';

import ChannelAnonymousImage from '../../../../src/components/AnonymousChat/child/ChannelAnonymousImage';

describe('TESTING ChannelAnonymousImage', () => {
  it('RENDER should match snapshot', () => {
    const {toJSON} = render(
      <ChannelAnonymousImage
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
      <ChannelAnonymousImage
        anonPostNotificationUserInfo={{
          anon_user_info_color_code: '#FF0000',
          anon_user_info_emoji_code: '🐘'
        }}
        imageStyle={{}}
      />
    );

    expect(getByTestId('anonPostNotificationImage')).toBeTruthy();
    expect(getByTestId('anonPostNotificationImage')).toHaveStyle({backgroundColor: '#FF0000'});
    expect(getByTestId('anonPostNotificationEmoji')).toBeTruthy();
    expect(getByText('🐘')).toBeTruthy();
  });
});
