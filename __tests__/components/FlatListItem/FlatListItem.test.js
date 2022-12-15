import * as React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react-native';
import FlatLisItem from '../../../src/components/FlatListItem';


describe('FlatLisItem should run correctly', () => {
// value, index, select, onSelect, icon, desc
    afterEach(cleanup)
    it('should match snapshot', () => {
        const onSelect = jest.fn()
  
        const {toJSON, getByTestId, getAllByTestId} = render(<FlatLisItem value={'agita'} index={1} select={1} onSelect={onSelect} icon={'https://image.jpg'} desc='inilah agita' />)
        expect(toJSON).toMatchSnapshot()
        expect(getAllByTestId('onselect')).toHaveLength(1)
        fireEvent.press(getByTestId('onselect'))
        expect(onSelect).toHaveBeenCalled()
        const { getByTestId:getNoIcon, getAllByTestId:getAllNoIcon} = render(<FlatLisItem value={'agita'} index={1} select={1} onSelect={onSelect} icon={null} desc='inilah agita' />)
        expect(getAllNoIcon('noicon')).toHaveLength(1)
        fireEvent.press(getNoIcon('noicon'))
        expect(onSelect).toHaveBeenCalled()
    })
})