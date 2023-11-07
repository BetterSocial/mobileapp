import * as React from 'react';
import {render} from '@testing-library/react-native';

import ChannelPostNotificationMessage from '../../../../src/components/AnonymousChat/child/ChannelPostNotificationMessage';
import {BaseChannelItemTypeProps} from '../../../../types/component/AnonymousChat/BaseChannelItem.types';

jest.mock('../../../../src/hooks/core/profile/useProfileHook', () => ({
  __esModule: true,
  default: () => ({profile: {user_id: '123'}})
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('TESTING ChatItemTargetText', () => {
  it('RENDER ANON_PM should match snapshot', () => {
    const {toJSON} = render(
      <ChannelPostNotificationMessage type={BaseChannelItemTypeProps.ANON_PM} />
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('RENDER non ANON_PM with no commenter name should match snapshot', () => {
    const {toJSON} = render(
      <ChannelPostNotificationMessage type={BaseChannelItemTypeProps.ANON_POST_NOTIFICATION} />
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('RENDER non ANON_PM with same profile id should match snapshot', () => {
    const {toJSON} = render(
      <ChannelPostNotificationMessage
        type={BaseChannelItemTypeProps.ANON_POST_NOTIFICATION}
        commenterId={'123'}
      />
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('RENDER non ANON_PM with different profile id should match snapshot', () => {
    const {toJSON} = render(
      <ChannelPostNotificationMessage
        type={BaseChannelItemTypeProps.ANON_POST_NOTIFICATION}
        commenterId={'456'}
        commenterName={'commenterName'}
      />
    );

    expect(toJSON()).toMatchSnapshot();
  });
});
