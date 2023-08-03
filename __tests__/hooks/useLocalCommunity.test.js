import React from 'react';
import {renderHook} from '@testing-library/react-hooks';
import {act} from 'react-test-renderer';
import useLocalCommunity from '../../src/screens/LocalCommunity/hooks/useLocalCommunity';
import * as apiServer from '../../src/api/server';
import {Context} from '../../src/context';

const mockGoBack = jest.fn();
const mockNavigate = jest.fn();
jest.mock('@react-navigation/core', () => ({
  ...jest.requireActual('@react-navigation/core'),
  useNavigation: () => ({
    goBack: mockGoBack,
    navigate: mockNavigate
  })
}));

const mockedFirebaseAnalyticsLogEvent = jest.fn();
const mockedFirebaseAnalyticsLogLogin = jest.fn();
const mockedFirebaseAnalyticsSetUserId = jest.fn();
jest.mock('@react-native-firebase/analytics', () => () => {
  return {
    logEvent: mockedFirebaseAnalyticsLogEvent,
    logLogin: mockedFirebaseAnalyticsLogLogin,
    setUserId: mockedFirebaseAnalyticsSetUserId
  };
});
const mockShowMesssage = jest.fn();

jest.mock('react-native-flash-message', () => ({
  default: () => ({
    showMessage: mockShowMesssage
  })
}));

describe('useLocalCommunity should run correctly', () => {
  const communityDispatch = jest.fn();
  const wrapper = ({children}) => (
    <Context.Provider
      value={{
        localCommunity: [{localCommunity: []}, communityDispatch]
      }}>
      {children}
    </Context.Provider>
  );

  it('handleKeyExtractor should run correctly', () => {
    const {result} = renderHook(() => useLocalCommunity(), {wrapper});
    expect(result.current.handleKeyExtractor({id: 1}, 1)).toEqual('1');
  });

  it('onPressSecondLocation should run correctly', () => {
    const {result} = renderHook(() => useLocalCommunity(), {wrapper});
    act(() => {
      result.current.onPressSecondLocation('open');
    });
    expect(result.current.isVisibleSecondLocation).toEqual('open');
  });

  it('onPressFirstLocation should run correctly', () => {
    const {result} = renderHook(() => useLocalCommunity(), {wrapper});
    act(() => {
      result.current.onPressFirstLocation('open');
    });
    expect(result.current.isVisibleFirstLocation).toEqual('open');
  });

  it('capitalizeFirstLetter should run correctly', () => {
    const {result} = renderHook(() => useLocalCommunity(), {wrapper});

    expect(result.current.capitalizeFirstLetter('test 123')).toEqual('Test 123');
  });

  it('handle search resolve should run correctly', async () => {
    jest
      .spyOn(apiServer, 'post')
      .mockResolvedValue({status: 200, data: {body: [{name: 'Los angles'}]}});
    const {result} = renderHook(() => useLocalCommunity(), {wrapper});
    await result.current.handleSearch();

    expect(result.current.optionsSearch).toEqual([{name: 'Los angles'}]);
    expect(result.current.isLoading).toBeFalsy();
    jest.spyOn(apiServer, 'post').mockRejectedValue({status: 500, data: null});
    expect(result.current.isLoading).toBeFalsy();
  });
  it('handle search rejected should run correctly', async () => {
    jest.spyOn(apiServer, 'post').mockRejectedValue({status: 500, data: null});

    const {result} = renderHook(() => useLocalCommunity(), {wrapper});
    await result.current.handleSearch();

    expect(result.current.optionsSearch).toEqual([]);
    expect(result.current.isLoading).toBeFalsy();
  });
  it('onChangeLocationsearch shoyld run correctly', () => {
    const {result} = renderHook(() => useLocalCommunity(), {wrapper});
    act(() => {
      result.current.onChangeLocationSearchText('los ang');
    });
    expect(result.current.optionsSearch).toEqual([]);
    expect(result.current.isLoading).toBeTruthy();
    act(() => {
      result.current.onChangeLocationSearchText('l');
    });
    expect(result.current.optionsSearch).toEqual([]);
    expect(result.current.isLoading).toBeFalsy();
  });

  it('handle delete should run correctly', async () => {
    const {result} = renderHook(() => useLocalCommunity(), {wrapper});
    await result.current.setLocation([
      {location_id: '123', name: 'Jakarta', city: 'jaksel', zip: '123456', location_level: 1},
      {location_id: '234', name: 'jogja', city: 'sleman', zip: '55592', location_level: 2}
    ]);
    await result.current.handleDelete('234');
    expect(result.current.location).toEqual([
      {location_id: '123', name: 'Jakarta', city: 'jaksel', zip: '123456', location_level: 1}
    ]);
    expect(result.current.locationPost).toEqual(['123']);
    expect(result.current.locationLog).toEqual([{location: 'jaksel, 123456', location_level: 1}]);
  });

  it('handle selected search should run correctly', async () => {
    const {result} = renderHook(() => useLocalCommunity(), {wrapper});
    const newLocation = {
      location_id: '123',
      name: 'Jateng',
      city: 'solo',
      zip: '123567',
      location_level: 3,
      neighborhood: 'jateng'
    };
    await result.current.setLocation([
      {location_id: '123', name: 'Jakarta', city: 'jaksel', zip: '123456', location_level: 1},
      {location_id: '234', name: 'jogja', city: 'sleman', zip: '55592', location_level: 2}
    ]);
    await result.current.handleSelectedSearch(newLocation, 2);
    expect(result.current.location).toEqual([
      {location_id: '123', name: 'Jakarta', city: 'jaksel', zip: '123456', location_level: 1},
      {location_id: '234', name: 'jogja', city: 'sleman', zip: '55592', location_level: 2},
      {
        location_id: '123',
        name: 'Jateng',
        city: 'solo',
        zip: '123567',
        location_level: 3,
        neighborhood: 'jateng'
      }
    ]);
    expect(result.current.search).toEqual('Jateng');
  });
  it('onBack should run correctly', () => {
    const {result} = renderHook(() => useLocalCommunity(), {wrapper});
    act(() => {
      result.current.onBack();
    });
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('handle selected search should run correctly', async () => {
    const {result} = renderHook(() => useLocalCommunity(), {wrapper});
    const newLocation = {
      location_id: '123',
      name: 'Jateng',
      city: 'solo',
      zip: '123567',
      location_level: 3,
      neighborhood: 'jateng'
    };
    await result.current.setLocation([]);
    await result.current.handleSelectedSearch(newLocation, 2);
    expect(result.current.location).toEqual([
      {
        location_id: '123',
        name: 'Jateng',
        city: 'solo',
        zip: '123567',
        location_level: 3,
        neighborhood: 'jateng'
      }
    ]);
    expect(result.current.search).toEqual('Jateng');
  });
  it('onPressTouchable should run correctly', () => {
    const {result} = renderHook(() => useLocalCommunity(), {wrapper});
    act(() => {
      result.current.onPressTouchable(1);
    });
    expect(result.current.isVisibleSecondLocation).toBeTruthy();
    act(() => {
      result.current.onPressTouchable(0);
    });
    expect(result.current.isVisibleFirstLocation).toBeTruthy();
  });
  it('next function should run correctly', async () => {
    const {result} = renderHook(() => useLocalCommunity(), {wrapper});
    await result.current.setLocation([{id: '123'}]);
    await result.current.next();
    expect(communityDispatch).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalled();
  });
});
