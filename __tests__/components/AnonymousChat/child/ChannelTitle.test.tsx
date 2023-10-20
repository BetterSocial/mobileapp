import * as React from 'react';
import {render} from '@testing-library/react-native';

import ChannelTitle from '../../../../src/components/AnonymousChat/child/ChannelTitle';
import {BaseChannelItemTypeProps} from '../../../../types/component/AnonymousChat/BaseChannelItem.types';

describe('TESTING ChatItemTargetText', () => {
  it('RENDER ANON_PM should match snapshot', () => {
    const {toJSON} = render(
      <ChannelTitle
        type={BaseChannelItemTypeProps.ANON_PM}
        name="name"
        time="time"
        message="message"
        unreadCount={0}
        isMe={false}
      />
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('RENDER ANON_PM with unreadcount should match snapshot', () => {
    const {toJSON} = render(
      <ChannelTitle
        type={BaseChannelItemTypeProps.ANON_PM}
        name="name"
        time="time"
        message="message"
        unreadCount={1}
        isMe={false}
      />
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('RENDER ANON_PM with isMe should match snapshot', () => {
    const {toJSON} = render(
      <ChannelTitle
        type={BaseChannelItemTypeProps.ANON_PM}
        name="name"
        time="time"
        message="message"
        unreadCount={0}
        isMe={true}
      />
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('RENDER MY_ANON_POST_NOTIFICATION should match snapshot', () => {
    const {toJSON} = render(
      <ChannelTitle
        type={BaseChannelItemTypeProps.MY_ANON_POST_NOTIFICATION}
        name="name"
        time="time"
        message="message"
        unreadCount={0}
        isMe={false}
      />
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('RENDER MY_ANON_POST_NOTIFICATION_I_COMMENTED should match snapshot', () => {
    const {toJSON} = render(
      <ChannelTitle
        type={BaseChannelItemTypeProps.MY_ANON_POST_NOTIFICATION_I_COMMENTED}
        name="name"
        time="time"
        message="message"
        unreadCount={0}
        isMe={false}
      />
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('RENDER MY_ANON_POST with no messages should match snapshot', () => {
    const {toJSON} = render(
      <ChannelTitle
        type={BaseChannelItemTypeProps.MY_ANON_POST_NOTIFICATION}
        name="name"
        time="time"
        message=""
        unreadCount={0}
        isMe={false}
      />
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('RENDER other type post with messages should match snapshot', () => {
    const {toJSON} = render(
      <ChannelTitle
        type={BaseChannelItemTypeProps.ANON_POST_NOTIFICATION}
        name="name"
        time="time"
        message="message"
        unreadCount={0}
        isMe={false}
      />
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('RENDER other type post with no messages should match snapshot', () => {
    const {toJSON} = render(
      <ChannelTitle
        type={BaseChannelItemTypeProps.ANON_POST_NOTIFICATION}
        name="name"
        time="time"
        message=""
        unreadCount={0}
        isMe={false}
      />
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('RENDER other type post with unreadcount should match snapshot', () => {
    const {toJSON} = render(
      <ChannelTitle
        type={BaseChannelItemTypeProps.ANON_POST_NOTIFICATION}
        name="name"
        time="time"
        message=""
        unreadCount={1}
        isMe={false}
      />
    );

    expect(toJSON()).toMatchSnapshot();
  });
});
