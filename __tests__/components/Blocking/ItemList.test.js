import * as React from 'react';
import renderer from 'react-test-renderer';
import {cleanup, fireEvent, render, act} from '@testing-library/react-native';
import ItemList from '../../../src/components/Blocking/ItemList';

describe('ItemList component should run correctly', () => {
  it('should match with snapshot', () => {
    const mockOnSelect = jest.fn();
    const {toJSON} = render(
      <ItemList label={'test'} active={true} onSelect={mockOnSelect} id={'123'} />
    );
    expect(toJSON).toMatchSnapshot();
  });

  it('onPress item should run correctly', async () => {
    const mockOnSelect = jest.fn();
    const {getByTestId} = render(
      <ItemList label={'test'} active={true} onSelect={mockOnSelect} id={'123'} />
    );
    await fireEvent.press(getByTestId('onPress'));
    expect(mockOnSelect).toHaveBeenCalled();
  });
});
