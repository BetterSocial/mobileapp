import * as React from 'react';
import { render, cleanup } from '@testing-library/react-native';
import Button from '../../../src/components/Button/Button';

const mockNavigate = jest.fn()

jest.mock('@react-navigation/core', () => ({
  ...jest.requireActual('@react-navigation/core'),
  useNavigation: () => ({
    goBack: jest.fn(), navigate: mockNavigate 
  }),
}));


describe('Button should run correctly', () => {
// onPress, style, label, labelStyle}
    afterEach(cleanup)
    it('should match snapshot', () => {
        const {toJSON, getAllByText} = render(<Button disabled={true} >Submit</Button>)
        expect(toJSON).toMatchSnapshot()
        expect(getAllByText('Submit')).toHaveLength(1)
    })
})