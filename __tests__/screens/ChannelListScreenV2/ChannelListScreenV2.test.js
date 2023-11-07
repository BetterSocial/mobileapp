/* eslint-disable react/display-name */
import * as React from 'react';
import {act, fireEvent, render, renderHook} from '@testing-library/react-native';

import ChannelListScreenV2 from '../../../src/screens/ChannelListScreenV2';
import Store from '../../../src/context/Store';
import useRootChannelListHook from '../../../src/hooks/screen/useRootChannelListHook';

jest.mock('react-native/Libraries/Pressability/usePressability');
jest.mock('../../../src/screens/ChannelListScreen', () => {
  return () => <></>;
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
});

const mockRefreshSignedChannelList = jest.fn();
const mockRefreshAnonymousChannelList = jest.fn();
jest.mock('../../../src/hooks/screen/useRootChannelListHook', () => {
  return jest.fn(() => ({
    anonymousChannelUnreadCount: 3,
    signedChannelUnreadCount: 0,
    totalUnreadCount: 3,
    refreshAnonymousChannelList: mockRefreshAnonymousChannelList,
    refreshSignedChannelList: mockRefreshSignedChannelList
  }));
});

describe('ChannelListScreenV2', () => {
  it('RENDER should match snapshot', () => {
    const {toJSON} = render(<ChannelListScreenV2 />, {wrapper: Store});
    expect(toJSON()).toMatchSnapshot();
  });

  it('RENDER should have two tabs', () => {
    const {findByTestId, findByText, queryByTestId} = render(<ChannelListScreenV2 />, {
      wrapper: Store
    });
    expect(findByTestId('horizontal-tab-0')).toBeTruthy();
    expect(findByText('as @JohnDoe')).toBeTruthy();
    expect(findByTestId('horizontal-tab-1')).toBeTruthy();
    expect(findByText('as Anonymous')).toBeTruthy();
    expect(findByTestId('signed-channel-list-tab-item')).toBeTruthy();
    expect(queryByTestId('signed-channel-list-tab-item-unread-count')).toBeFalsy();
    expect(findByTestId('anonymous-channel-list-tab-item')).toBeTruthy();
  });
});
