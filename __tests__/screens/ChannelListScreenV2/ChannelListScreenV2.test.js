/* eslint-disable react/display-name */
import {render} from '@testing-library/react-native';
import * as React from 'react';
import mock from 'react-native-permissions/mock';
import PushNotification from 'react-native-push-notification';

import {Alert} from 'react-native';
import Store from '../../../src/context/Store';
import ChannelListScreenV2 from '../../../src/screens/ChannelListScreenV2';
import StorageUtils from '../../../src/utils/storage';

jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'),
  Alert: {alert: jest.fn()}
}));

jest.mock('../../../src/utils/storage', () => {
  return {
    lastPromptNotification: {
      get: jest.fn(),
      set: jest.fn()
    }
  };
});

jest.mock('react-native-permissions', () => ({
  openSettings: jest.fn().mockResolvedValue(true)
}));

jest.mock('react-native/Libraries/Pressability/usePressability');
jest.mock('../../../src/screens/ChannelListScreen', () => {
  return () => <></>;
});

jest.mock('react-native-push-notification', () => ({
  configure: jest.fn(),
  onRegister: jest.fn(),
  onNotification: jest.fn(),
  addEventListener: jest.fn(),
  requestPermissions: jest.fn(),
  checkPermissions: jest.fn()
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
  default: {
    configure: jest.fn(),
    onRegister: jest.fn(),
    onNotification: jest.fn(),
    addEventListener: jest.fn(),
    requestPermissions: jest.fn(),
    checkPermissions: jest.fn()
  }
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

jest.mock('@react-navigation/core', () => ({
  ...jest.requireActual('@react-navigation/core'),
  useNavigation: () => ({
    navigate: jest.fn(),
    isFocused: jest.fn()
  })
}));

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

jest.mock('react-native-push-notification', () => ({
  checkPermissions: jest.fn()
  // Add other methods from PushNotification that you use
}));

describe('ChannelListScreenV2 useEffect', () => {
  let alertSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    alertSpy = jest.spyOn(Alert, 'alert'); // Spy on Alert.alert
  });

  afterEach(() => {
    alertSpy.mockRestore(); // Restore the original implementation after each test
  });

  it('should not show prompt if screen is not focused', async () => {
    const mockIsFocused = jest.fn(() => false);
    jest.mock('@react-navigation/native', () => ({
      ...jest.requireActual('@react-navigation/native'),
      useNavigation: () => ({
        isFocused: mockIsFocused
      })
    }));

    render(<ChannelListScreenV2 />, {wrapper: Store});
    jest.advanceTimersByTime(20000); // Advance timers by 20 seconds
    expect(PushNotification.checkPermissions).not.toHaveBeenCalled();
  });

  it('should handle authorizationStatus 1 with needsPermission', async () => {
    PushNotification.checkPermissions.mockImplementation((callback) => {
      callback({authorizationStatus: 1, alert: false, badge: true, sound: true});
    });
    StorageUtils.lastPromptNotification.get.mockReturnValue(jest.getRealSystemTime);

    render(<ChannelListScreenV2 />, {wrapper: Store});
    jest.advanceTimersByTime(20000);
    expect(StorageUtils.lastPromptNotification.set).not.toHaveBeenCalled();
    expect(Alert.alert).not.toBeCalled();
  });

  // Add similar tests for other cases and scenarios
});
