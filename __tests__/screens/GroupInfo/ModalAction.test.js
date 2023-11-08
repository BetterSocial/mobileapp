import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import ModalAction from '../../../src/screens/GroupInfo/elements/ModalAction';

describe('ModalAction element should run correctly', () => {
  it('should match snapshot', () => {
    const {toJSON} = render(<ModalAction />);
    expect(toJSON()).toMatchSnapshot();
  });
  it('onPress should trigger correctly', async () => {
    const onPress = jest.fn();
    const {getByTestId} = render(<ModalAction onPress={onPress} />);
    await fireEvent.press(getByTestId('pressMessage'));
    expect(onPress).toHaveBeenCalled();
    await fireEvent.press(getByTestId('pressMessageAnonym'));
    expect(onPress).toHaveBeenCalled();
    await fireEvent.press(getByTestId('pressView'));
    expect(onPress).toHaveBeenCalled();
  });
  it('onPress should trigger correctly', async () => {
    const onPress = jest.fn();
    const {getByTestId} = render(<ModalAction isGroup onPress={onPress} />);
    await fireEvent.press(getByTestId('pressRemove'));
    expect(onPress).toHaveBeenCalled();
  });
});
