import React from 'react';
import {act, fireEvent, render} from '@testing-library/react-native';

import Settings from '../../../src/screens/Settings';
import Store from '../../../src/context/Store';

const mockLogScreenView = jest.fn();
const mockGoBack = jest.fn();
const mockNavigate = jest.fn();

jest.useFakeTimers();

jest.mock('@react-native-firebase/analytics', () => () => ({
  logEvent: jest.fn(),
  logLogin: jest.fn(),
  setUserId: jest.fn(),
  logScreenView: mockLogScreenView
}));

jest.mock('@react-navigation/core', () => ({
  ...jest.requireActual('@react-navigation/core'),
  useNavigation: () => ({goBack: mockGoBack, navigate: mockNavigate}),
  useRoute: () => ({
    params: {}
  })
}));

jest.mock('../../../src/hooks/useAfterInteractions', () => ({
  useAfterInteractions: () => ({
    transitionRef: {current: {animateNextTransition: jest.fn()}},
    interactionsComplete: true
  })
}));

// mock useRecoilValue
jest.mock('recoil', () => ({
  useRecoilValue: jest.fn(() => 0),
  atom: jest.fn(() => 0),
  useSetRecoilState: jest.fn(() => 0),
  useRecoilState: jest.fn(() => [0, jest.fn()])
}));

describe('Settings page should run correctly', () => {
  it('Should match snapshot', () => {
    const {toJSON} = render(<Settings />, {wrapper: Store});
    expect(toJSON).toMatchSnapshot();
  });

  it('back button should run back', () => {
    const {getByTestId} = render(<Settings />, {wrapper: Store});
    act(() => {
      fireEvent.press(getByTestId('backButton'));
    });
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('profileSetting on press should navigate to other page', () => {
    const {getByTestId} = render(<Settings />, {wrapper: Store});
    act(() => {
      fireEvent.press(getByTestId('blocked'));
    });
    expect(mockNavigate).toHaveBeenCalled();
    act(() => {
      fireEvent.press(getByTestId('privacy'));
    });
    expect(mockNavigate).toHaveBeenCalled();
    act(() => {
      fireEvent.press(getByTestId('help'));
    });
    expect(mockNavigate).toHaveBeenCalled();
  });
});
