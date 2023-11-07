import * as React from 'react';
import {render} from '@testing-library/react-native';

import ChannelPostNotificationStats from '../../../../src/components/AnonymousChat/child/ChannelPostNotificationStats';
import {BaseChannelItemTypeProps} from '../../../../types/component/AnonymousChat/BaseChannelItem.types';

describe('TESTING ChatItemTargetText', () => {
  it('RENDER type ANON_PM should match snapshot', () => {
    const {toJSON} = render(
      <ChannelPostNotificationStats type={BaseChannelItemTypeProps.ANON_PM} />
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('RENDER not shown should match snapshot', () => {
    const {toJSON} = render(
      <ChannelPostNotificationStats
        type={BaseChannelItemTypeProps.ANON_POST_NOTIFICATION}
        shown={false}
      />
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('RENDER with block should match snapshot', () => {
    const {toJSON} = render(
      <ChannelPostNotificationStats
        type={BaseChannelItemTypeProps.ANON_POST_NOTIFICATION}
        shown={true}
        block={1}
        upvote={1}
        comments={1}
        downvote={0}
      />
    );

    expect(toJSON()).toMatchSnapshot();
  });
  it('RENDER with no block should match snapshot', () => {
    const {toJSON} = render(
      <ChannelPostNotificationStats
        type={BaseChannelItemTypeProps.ANON_POST_NOTIFICATION}
        shown={true}
        block={0}
        upvote={1}
        comments={1}
        downvote={0}
      />
    );

    expect(toJSON()).toMatchSnapshot();
  });
});
