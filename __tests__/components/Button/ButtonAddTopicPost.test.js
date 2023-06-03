import * as React from 'react';
import {fireEvent, render} from '@testing-library/react-native';

import ButtonAddPostTopic from '../../../src/components/Button/ButtonAddPostTopic';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/core', () => ({
  ...jest.requireActual('@react-navigation/core'),
  useNavigation: () => ({
    goBack: jest.fn(),
    navigate: mockNavigate
  })
}));

// eslint-disable-next-line react/display-name
jest.mock('react-native-shadow-2', () => ({
  ...jest.requireActual('react-native-shadow-2'),
  Shadow: (props) => <>{props.children}</>
}));

describe('Testing Button Add Topic Post', () => {
  it('should match snapshot', () => {
    const {toJSON} = render(<ButtonAddPostTopic />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('Should navigate to create post screen when clicked', () => {
    const {getByTestId} = render(<ButtonAddPostTopic topicName={'TestTopic'} />);
    fireEvent.press(getByTestId('onaddtopicbutton'));
    expect(mockNavigate).toHaveBeenCalledWith('CreatePost', {
      topic: 'TestTopic'
    });
  });

  it('Should navigate to create post screen when clicked and on refresh param if provided', () => {
    const mockOnRefresh = jest.fn();

    const {getByTestId} = render(
      <ButtonAddPostTopic topicName={'TestTopic'} onRefresh={mockOnRefresh} />
    );
    fireEvent.press(getByTestId('onaddtopicbutton'));
    expect(mockNavigate).toHaveBeenCalledWith('CreatePost', {
      topic: 'TestTopic',
      onRefresh: mockOnRefresh
    });
  });
});
