import React from 'react';
import {renderHook} from '@testing-library/react-hooks';
import useOnBoardingTopics from '../../src/screens/Topics/hooks/useOnBoardingTopics';
import * as serviceCache from '../../src/utils/cache';
import {Context} from '../../src/context';

const mockedPushNavigation = jest.fn();
const mockedNavigateNavigation = jest.fn();
const mockedResetNavigation = jest.fn();
const mockGoBack = jest.fn();
const mockLogEvent = jest.fn();
jest.mock('@react-navigation/core', () => ({
  ...jest.requireActual('@react-navigation/core'),
  useNavigation: () => ({
    navigate: mockedNavigateNavigation,
    push: mockedPushNavigation,
    reset: mockedResetNavigation,
    goBack: mockGoBack
  })
}));

jest.mock('@react-native-firebase/analytics', () => () => ({
  logEvent: mockLogEvent,
  logLogin: jest.fn(),
  setUserId: jest.fn()
}));

describe('useOnboradingTopics should run correctly', () => {
  const mockDispatch = jest.fn();
  const wrapper = ({children}) => (
    <Context.Provider
      value={{
        topics: [, mockDispatch]
      }}>
      {children}
    </Context.Provider>
  );

  it('getCacheTopic should run correctly', async () => {
    const {result} = renderHook(useOnBoardingTopics, {wrapper});
    const spyCache = jest.spyOn(serviceCache, 'getSpecificCache');
    await result.current.getCacheTopic();
    expect(spyCache).toHaveBeenCalled();
  });

  it('onBack should run correctly', async () => {
    const {result} = renderHook(useOnBoardingTopics, {wrapper});
    await result.current.onBack();
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('keyExtractor should run correctly', () => {
    const {result} = renderHook(useOnBoardingTopics, {wrapper});
    expect(result.current.keyExtractor('123', 123)).toEqual('123');
  });
  it('next function should run correctly', async () => {
    const {result} = renderHook(useOnBoardingTopics, {wrapper});
    await result.current.setMinTopic(2);
    await result.current.setTopicSelected([
      {id: '123', name: 'technology'},
      {id: '124', name: 'sport'},
      {id: '125', name: 'apple'}
    ]);
    await result.current.next();
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockedNavigateNavigation).toHaveBeenCalled();
    expect(mockLogEvent).toHaveBeenCalled();
  });

  it('handleSelectedLanguage should run correctly', async () => {
    const {result} = renderHook(useOnBoardingTopics, {wrapper});
    await result.current.setMyTopic({1234: {name: 'apple'}, 234: {name: 'microsoft'}});
    await result.current.handleSelectedLanguage('1234');
    expect(result.current.myTopic).toEqual({1234: '1234'});
  });

  it('handleSelectedLanguage 2 should run correctly', async () => {
    const {result} = renderHook(useOnBoardingTopics, {wrapper});
    await result.current.setMyTopic({1234: undefined, 234: {name: 'microsoft'}});
    await result.current.handleSelectedLanguage('1234');
    expect(result.current.myTopic).toEqual({1234: '1234'});
  });
});
