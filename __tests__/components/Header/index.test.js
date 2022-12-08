import * as React from 'react';
import { render, cleanup } from '@testing-library/react-native';
import Header from '../../../src/components/Header';

describe('Header component should run correctly', () => {

    afterEach(cleanup)

    it('should match snapshot', () => {
        const onPress = jest.fn()
        const {toJSON} = render(<Header title={'halaman test'} onPress={onPress}  isCenter={false} />)
        expect(toJSON).toMatchSnapshot()
    })
})