import * as React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {act} from 'react-test-renderer';
import ButtonAddParticipants from '../../../src/components/Button/ButtonAddParticipants';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/core', () => ({
  ...jest.requireActual('@react-navigation/core'),
  useNavigation: () => ({
    goBack: jest.fn(),
    navigate: mockNavigate
  })
}));

describe('ButtonAddParticipant should run correctly', () => {
  it('should be match with snapshot', () => {
    const refresh = jest.fn();
    const {toJSON, getByTestId} = render(<ButtonAddParticipants reafresh={refresh} />);
    act(() => {
      fireEvent.press(getByTestId('btnPress'));
    });
    expect(mockNavigate).toHaveBeenCalled();
    expect(toJSON).toMatchSnapshot();
  });
});
