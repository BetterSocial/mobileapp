import React from 'react';
import {act, fireEvent, render} from '@testing-library/react-native';
import Settings from '../../../src/screens/Settings';
import Store from '../../../src/context/Store';
import * as useSetting from '../../../src/screens/Settings/hooks/useSettings';

const mockLogScreenView = jest.fn();
const mockGoBack = jest.fn();
const mockNavigate = jest.fn();
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

describe('Settings page should run correctly', () => {
  const mockLogout = jest.fn();
  const mockStartupValue = jest.fn();
  const showDeleteAccountAlert = jest.fn();
  beforeEach(() => {
    jest.spyOn(useSetting, 'default').mockImplementation(() => ({
      logout: mockLogout,
      setStartupValue: mockStartupValue,
      showDeleteAccountAlert
    }));
  });

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

  it('onLogout should run correctly', () => {
    const {getByTestId} = render(<Settings />, {wrapper: Store});
    act(() => {
      fireEvent.press(getByTestId('logout'));
    });
    expect(mockLogout).toHaveBeenCalled();
    expect(mockStartupValue).toHaveBeenCalled();
  });

  it('delete account should run correctly', () => {
    const {getByTestId} = render(<Settings />, {wrapper: Store});
    act(() => {
      fireEvent.press(getByTestId('delete'));
    });
    expect(showDeleteAccountAlert).toHaveBeenCalled();
  });
});
