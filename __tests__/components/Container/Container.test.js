import * as React from 'react';
import { Text } from 'react-native';
import { render, cleanup } from '@testing-library/react-native';
import Container from '../../../src/components/Container';

jest.mock('../../../src/components/CustomMessageSystem', () => ({
    isDeviceIos: jest.fn().mockImplementation(() => true)
}))

describe('Container should run correctly', () => {
    afterEach(cleanup)
    it('should match snapshot', () => {
        
        const {toJSON, getAllByText} = render(<Container ><Text>Halo</Text> </Container>)
        expect(toJSON).toMatchSnapshot()
        expect(getAllByText('Halo')).toHaveLength(1)
    })
})