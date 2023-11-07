import * as React from 'react';
import {fireEvent, render} from '@testing-library/react-native';

import ChatDetailHeader from '../../../src/components/AnonymousChat/ChatDetailHeader';

jest.mock('react-native/Libraries/Pressability/usePressability');
const mockOnBackPress = jest.fn();
const mockOnAvatarPress = jest.fn();
const mockOnOptionPress = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

describe('TESTING AnonymousChatHeader', () => {
  it('RENDER should match snapshot', () => {
    const {toJSON} = render(<ChatDetailHeader user="Username" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('RENDER should render elements with correct value', () => {
    const {getByTestId, getByText} = render(<ChatDetailHeader user="Username" />);
    expect(getByTestId('username')).toBeTruthy();
    expect(getByText('Username')).toBeTruthy();
    expect(getByTestId('pressable-back')).toBeTruthy();
    expect(getByTestId('pressable-avatar')).toBeTruthy();
    expect(getByTestId('pressable-option')).toBeTruthy();
  });

  it('EVENT should call onBackPress when pressing back button', () => {
    const {getByTestId} = render(
      <ChatDetailHeader
        user="Username"
        onAvatarPress={mockOnAvatarPress}
        onBackPress={mockOnBackPress}
        onThreeDotPress={mockOnOptionPress}
      />
    );
    fireEvent.press(getByTestId('pressable-back'));
    expect(mockOnBackPress).toBeCalledTimes(1);
  });

  it('EVENT should call onAvatarPress when pressing avatar', () => {
    const {getByTestId} = render(
      <ChatDetailHeader
        user="Username"
        onAvatarPress={mockOnAvatarPress}
        onBackPress={mockOnBackPress}
        onThreeDotPress={mockOnOptionPress}
      />
    );
    fireEvent.press(getByTestId('pressable-avatar'));
    expect(mockOnAvatarPress).toBeCalledTimes(1);
  });

  it('EVENT should call onThreeDotPress when pressing three dots button', () => {
    const {getByTestId} = render(
      <ChatDetailHeader
        user="Username"
        onAvatarPress={mockOnAvatarPress}
        onBackPress={mockOnBackPress}
        onThreeDotPress={mockOnOptionPress}
      />
    );
    fireEvent.press(getByTestId('pressable-option'));
    expect(mockOnOptionPress).toBeCalledTimes(1);
  });
});
