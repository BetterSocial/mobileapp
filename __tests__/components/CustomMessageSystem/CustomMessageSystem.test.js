import * as React from 'react';
import { render, cleanup } from '@testing-library/react-native';
import CustomMessageSystem from '../../../src/components/CustomMessageSystem';


describe('CustomMessageSystem should run correctly', () => {
    afterEach(cleanup)
    it('should match snapshot', () => {
        
        const {toJSON, getAllByText} = render(<CustomMessageSystem text={'error lagi nih'} />)
        expect(toJSON).toMatchSnapshot()
        expect(getAllByText('error lagi nih')).toHaveLength(1)
    })
})