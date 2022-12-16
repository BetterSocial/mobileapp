import * as React from 'react';
import { render, cleanup } from '@testing-library/react-native';
import LoadingComment from '../../../src/components/LoadingComment';

jest.mock('react-native-linear-gradient')

describe('LoadingComment component should run correctly', () => {

    afterEach(cleanup)

    it('should match snapshot', () => {
        const {toJSON} = render(<LoadingComment  />)
        expect(toJSON).toMatchSnapshot()
    })
})