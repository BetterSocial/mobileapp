import * as React from 'react';
import {render, cleanup, fireEvent} from '@testing-library/react-native';
import {Animated} from 'react-native';
import ButtonNewPost from '../../../src/components/Button/ButtonNewPost';
import Store from '../../../src/context/Store';
import * as actionFeed from '../../../src/context/actions/feeds';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/core', () => ({
  ...jest.requireActual('@react-navigation/core'),
  useNavigation: () => ({
    goBack: jest.fn(),
    navigate: mockNavigate
  })
}));

describe('ButtonNewPost should run correctly', () => {
  // eslint-disable-next-line no-import-assign
  React.hasOwnProperty = () => Object.hasOwnProperty;
  const mockContext = jest.spyOn(React, 'useContext');
  const mockTiming = jest.fn();
  beforeEach(() => {
    jest.spyOn(React, 'useRef').mockImplementation(() => ({current: {interpolate: jest.fn()}}));
    jest.spyOn(Animated, 'timing').mockImplementation(() => ({start: mockTiming}))
    mockContext.mockReturnValue({
      feeds: [{id: '123'}]
    });
  });

  afterEach(cleanup);
  it('should match snapshot', () => {
    const mockTimer = jest.spyOn(actionFeed, 'setTimer');
    const {toJSON, getByTestId} = render(<ButtonNewPost />, {wrapper: Store});
    expect(toJSON).toMatchSnapshot();
    fireEvent.press(getByTestId('onpress'));
    expect(mockNavigate).toHaveBeenCalled();
    expect(mockTimer).toHaveBeenCalled();
    expect(mockTiming).toHaveBeenCalled();
  });
});
