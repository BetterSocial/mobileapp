import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import ItemList from '../../../src/components/Blocking/ItemList';
describe('Item List block should run correctly', () => {
  it('should match snapshot', async () => {
    const setStateMock = jest.fn();
    const useStateMock = (useState) => [useState, setStateMock];
    jest.spyOn(React, 'useState').mockImplementation(useStateMock);
    const onSelect = jest.fn();
    const {getAllByText, toJSON, getByTestId} = render(
      <ItemList active={true} onSelect={onSelect} label={'test'} />
    );
    expect(toJSON).toMatchSnapshot();
    expect(getAllByText('test')).toHaveLength(1);
    await fireEvent.press(getByTestId('click'));
    expect(onSelect).toHaveBeenCalled();
  });
});
