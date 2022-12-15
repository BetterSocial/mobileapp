import * as React from 'react';
import { render, cleanup } from '@testing-library/react-native';
import Gap from '../../../src/components/Gap';


describe('Gap should run correctly', () => {


    afterEach(cleanup)
    it('should match snapshot', () => {
        const {toJSON, getByTestId} = render(<Gap width={20} height={2} />)
        expect(toJSON).toMatchSnapshot()
        expect(getByTestId('gap').props.style).toEqual([{"height": 2, "width": 20}, undefined])
    })
})