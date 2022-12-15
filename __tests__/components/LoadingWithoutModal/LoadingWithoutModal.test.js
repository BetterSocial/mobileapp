import * as React from 'react';
import { render, cleanup } from '@testing-library/react-native';
import LoadingWithoutModal from '../../../src/components/LoadingWithoutModal';


describe('LoadingWithoutModal component should run correctly', () => {

    afterEach(cleanup)

    it('should match snapshot', () => {
        const {toJSON} = render(<LoadingWithoutModal visible={true} />)
        expect(toJSON).toMatchSnapshot()
    })
})