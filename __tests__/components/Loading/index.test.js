import * as React from 'react';
import { render, cleanup } from '@testing-library/react-native';
import Loading from '../../../src/components/Loading';


describe('Loading component should run correctly', () => {

    afterEach(cleanup)

    it('should match snapshot', () => {
        const {toJSON} = render(<Loading visible={true} />)
        expect(toJSON).toMatchSnapshot()
    })
})