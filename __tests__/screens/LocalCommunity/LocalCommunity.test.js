import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {Animated} from 'react-native';
import LocalCommunity from '../../../src/screens/LocalCommunity';
import {Context} from '../../../src/context/Store';
import * as useLocalCommunity from '../../../src/screens/LocalCommunity/hooks/useLocalCommunity';

jest.mock('react-native/Libraries/Pressability/usePressability');

const wrapper = ({children}) => (
  <Context.Provider
    value={{
      localCommunity: [{localCommunity: []}]
    }}>
    {children}
  </Context.Provider>
);

describe('it should run correctly', () => {
  const mockInterpolate = jest.fn();
  const mockTiming = jest.fn();
  const mockDeleteLocation = jest.fn();
  const onPressSecondLocationMock = jest.fn();
  const mockGoBackBtn = jest.fn();
  const mockPresssFirstLocation = jest.fn();
  const mockPresssTouchable = jest.fn();
  const mockNext = jest.fn();
  const mockChangeLocation = jest.fn();
  const mocksetIsVisibleSecondLocation = jest.fn();
  const mocksetIsVisibleFirstLocation = jest.fn();
  const mockHandleSelectedSearch = jest.fn();
  const mockSetSearch = jest.fn();

  beforeEach(() => {
    jest
      .spyOn(React, 'useRef')
      .mockImplementation(() => ({current: {interpolate: mockInterpolate}}));
    jest.spyOn(Animated, 'timing').mockImplementation(() => ({start: mockTiming}));
    jest.spyOn(useLocalCommunity, 'default').mockImplementation(() => ({
      location: [
        {
          location_id: '123',
          name: 'Jakarta',
          city: 'jaksel',
          zip: '123456',
          location_level: 'neighborhood'
        }
      ],
      handleDelete: mockDeleteLocation,
      onBack: mockGoBackBtn,
      onPressFirstLocation: mockPresssFirstLocation,
      onPressTouchable: mockPresssTouchable,
      next: mockNext,
      onPressSecondLocation: onPressSecondLocationMock,
      onChangeLocationSearchText: mockChangeLocation,
      setIsVisibleFirstLocation: mocksetIsVisibleFirstLocation,
      setSearch: mockSetSearch,
      setIsVisibleSecondLocation: mocksetIsVisibleSecondLocation,
      optionsSearch: [
        {
          location_id: '234',
          name: 'jogja',
          city: 'sleman',
          zip: '55592',
          location_level: 'neighborhood'
        }
      ],
      handleSelectedSearch: mockHandleSelectedSearch
    }));
  });

  it('Should match snapshot', () => {
    const {toJSON} = render(<LocalCommunity />, {wrapper});
    expect(mockInterpolate).toHaveBeenCalled();
    expect(toJSON).toMatchSnapshot();
  });

  it('back button should run correctly', () => {
    const {getByTestId} = render(<LocalCommunity />, {wrapper});
    fireEvent.press(getByTestId('backButton'));
    expect(mockGoBackBtn).toHaveBeenCalled();
  });

  it('onCloseModal 1 should run correctly', () => {
    const {getAllByTestId} = render(<LocalCommunity />, {wrapper});
    fireEvent.press(getAllByTestId('onCloseModal')[0]);
    expect(mockPresssFirstLocation).toHaveBeenCalled();
  });

  it('onCloseModal 2 should run correctly', () => {
    const {getAllByTestId} = render(<LocalCommunity />, {wrapper});
    fireEvent.press(getAllByTestId('onCloseModal')[1]);
    expect(onPressSecondLocationMock).toHaveBeenCalled();
  });

  it('onNext should run correctly', () => {
    const {getByTestId} = render(<LocalCommunity />, {wrapper});
    fireEvent.press(getByTestId('btn'));
    expect(mockNext).toHaveBeenCalled();
  });

  it('change text should run correctly', () => {
    const {getAllByTestId} = render(<LocalCommunity />, {wrapper});
    fireEvent.changeText(getAllByTestId('textAreaTest')[0]);
    expect(mockChangeLocation).toHaveBeenCalled();
    fireEvent.changeText(getAllByTestId('textAreaTest')[1]);
    expect(mockChangeLocation).toHaveBeenCalled();
  });

  it('onPressSecondLocation  should run correctly', () => {
    const {getByTestId} = render(<LocalCommunity />, {wrapper});
    fireEvent.press(getByTestId('onPressSecondLocation'));
    expect(onPressSecondLocationMock).toHaveBeenCalled();
  });

  it('onSelectLocation should run correctly', () => {
    const {getAllByTestId} = render(<LocalCommunity />, {wrapper});
    fireEvent.press(getAllByTestId('selectLocation')[0]);
    expect(mocksetIsVisibleFirstLocation).toHaveBeenCalled();
    expect(mockSetSearch).toHaveBeenCalled();
    expect(mockHandleSelectedSearch).toHaveBeenCalled();
    fireEvent.press(getAllByTestId('selectLocation')[1]);
    expect(mocksetIsVisibleSecondLocation).toHaveBeenCalled();
    expect(mockSetSearch).toHaveBeenCalled();
    expect(mockHandleSelectedSearch).toHaveBeenCalled();
  });

  it('deleteLocation should run correctly', () => {
    const {getAllByTestId} = render(<LocalCommunity />, {wrapper});
    fireEvent.press(getAllByTestId('deleteLocation')[0]);
    expect(mockDeleteLocation).toHaveBeenCalled();
  });

  it('onPressLocation should run correctly', () => {
    const {getAllByTestId} = render(<LocalCommunity />, {wrapper});
    fireEvent.press(getAllByTestId('onPressLocation')[0]);
    expect(mockPresssTouchable).toHaveBeenCalled();
  });
});

describe('onPress first location should run correctly', () => {
  const wrapper = ({children}) => (
    <Context.Provider
      value={{
        localCommunity: [{localCommunity: []}]
      }}>
      {children}
    </Context.Provider>
  );

  const mockInterpolate = jest.fn();
  const mockTiming = jest.fn();
  const mockDeleteLocation = jest.fn();
  const onPressSecondLocationMock = jest.fn();
  const mockGoBackBtn = jest.fn();
  const mockPresssFirstLocation = jest.fn();
  const mockPresssTouchable = jest.fn();
  const mockNext = jest.fn();
  const mockChangeLocation = jest.fn();
  const mocksetIsVisibleSecondLocation = jest.fn();
  const mocksetIsVisibleFirstLocation = jest.fn();
  const mockHandleSelectedSearch = jest.fn();
  const mockSetSearch = jest.fn();

  beforeEach(() => {
    jest
      .spyOn(React, 'useRef')
      .mockImplementation(() => ({current: {interpolate: mockInterpolate}}));
    jest.spyOn(Animated, 'timing').mockImplementation(() => ({start: mockTiming}));
    jest.spyOn(useLocalCommunity, 'default').mockImplementation(() => ({
      location: [],
      handleDelete: mockDeleteLocation,
      onBack: mockGoBackBtn,
      onPressFirstLocation: mockPresssFirstLocation,
      onPressTouchable: mockPresssTouchable,
      next: mockNext,
      onPressSecondLocation: onPressSecondLocationMock,
      onChangeLocationSearchText: mockChangeLocation,
      setIsVisibleFirstLocation: mocksetIsVisibleFirstLocation,
      setSearch: mockSetSearch,
      setIsVisibleSecondLocation: mocksetIsVisibleSecondLocation,
      optionsSearch: [
        {
          location_id: '234',
          name: 'jogja',
          city: 'sleman',
          zip: '55592',
          location_level: 'neighborhood'
        }
      ],
      handleSelectedSearch: mockHandleSelectedSearch
    }));
  });
  it('onPressFirstLocation  should run correctly', () => {
    const {getByTestId} = render(<LocalCommunity />, {wrapper});
    fireEvent.press(getByTestId('onPressFirstLocation'));
    expect(mockPresssFirstLocation).toHaveBeenCalled();
  });
});
