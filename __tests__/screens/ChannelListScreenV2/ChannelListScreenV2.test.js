/* eslint-disable react/display-name */
import {act, fireEvent, render, renderHook} from '@testing-library/react-native';
import * as React from 'react';
import mock from 'react-native-permissions/mock';

import Store from '../../../src/context/Store';
import useRootChannelListHook from '../../../src/hooks/screen/useRootChannelListHook';
import ChannelListScreenV2 from '../../../src/screens/ChannelListScreenV2';

jest.mock('react-native/Libraries/Pressability/usePressability');
jest.mock('../../../src/screens/ChannelListScreen', () => {
  return () => <></>;
});

jest.mock('react-native-push-notification', () => ({
  configure: jest.fn(),
  onRegister: jest.fn(),
  onNotification: jest.fn(),
  addEventListener: jest.fn(),
  requestPermissions: jest.fn()
}));

jest.mock('react-native-permissions', () => {
  return mock;
});

jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      isFocused: jest.fn().mockImplementation(() => true) // Or a function that returns false
    })
  };
});

jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'),
  Alert: {alert: jest.fn()}
}));

jest.mock('@react-native-firebase/messaging', () => {
  return {
    ...jest.requireActual('@react-native-firebase/messaging'),
    messaging: () => ({
      requestPermission: jest.fn(),
      getToken: jest.fn()
    })
  };
});

jest.mock('react-native-push-notification', () => ({
  checkPermissions: jest.fn()
}));

describe('ChannelListScreenV2 requestPermission', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
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
    expect(queryByTestId('anonymous-channel-list-tab-item-unread-count')).toBeTruthy();
  });

  it('EVENT should call refresh signed channel list when signed chat tab is pressed', () => {
    const {getByTestId} = render(<ChannelListScreenV2 />, {wrapper: Store});
    renderHook(() => useRootChannelListHook(), {wrapper: Store});
    act(() => {
      fireEvent.press(getByTestId('horizontal-tab-0'));
    });

    expect(mockRefreshSignedChannelList).toHaveBeenCalled();
  });

  it('EVENT should call refresh anonymous channel list when anonymous chat tab is pressed', () => {
    const {getByTestId} = render(<ChannelListScreenV2 />, {wrapper: Store});
    renderHook(() => useRootChannelListHook(), {wrapper: Store});
    act(() => {
      fireEvent.press(getByTestId('horizontal-tab-1'));
    });

    expect(mockRefreshAnonymousChannelList).toHaveBeenCalled();
  });
});
