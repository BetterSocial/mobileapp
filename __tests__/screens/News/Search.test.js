import React from 'react';
import {cleanup, fireEvent, render} from '@testing-library/react-native';

import Search from '../../../src/screens/NewsScreen/Search';

jest.mock('react-native/Libraries/Pressability/usePressability');
const mockPush = jest.fn();
const mockBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({goBack: mockBack, push: mockPush}),
  useRoute: () => ({
    params: {}
  })
}));
describe('News search should run correctly', () => {
  afterEach(cleanup);
  it('Should match snapshot', () => {
    const {toJSON} = render(<Search />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('containerPress should run correctly', () => {
    const {getByTestId} = render(<Search />);
    fireEvent.press(getByTestId('containerPress'));
    expect(mockPush).toHaveBeenCalled();
  });

  it('arrow left should navigate back', () => {
    const {getByTestId} = render(<Search />);
    fireEvent.press(getByTestId('news-search-back-button'));
    expect(mockBack).toHaveBeenCalled();
  });
});
