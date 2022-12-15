import * as React from 'react';
import { render, cleanup } from '@testing-library/react-native';
import Input from '../../../src/components/Input/Input';


describe('Input should run correctly', () => {


    afterEach(cleanup)
    it('should match snapshot', () => {
        const {toJSON} = render(<Input  />)
        expect(toJSON).toMatchSnapshot()
    })
})