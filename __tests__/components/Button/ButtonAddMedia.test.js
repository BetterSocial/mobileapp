import * as React from 'react';
import { render, cleanup } from '@testing-library/react-native';
import ButtonAddMedia from '../../../src/components/Button/ButtonAddMedia';

const mockNavigate = jest.fn()

jest.mock('@react-navigation/core', () => ({
  ...jest.requireActual('@react-navigation/core'),
  useNavigation: () => ({
    goBack: jest.fn(), navigate: mockNavigate 
  }),
}));


describe('ButtonAddMedia should run correctly', () => {
// onPress, style, label, labelStyle}
    afterEach(cleanup)
    it('should match snapshot', () => {
        const handleOnpress = jest.fn()
        const {toJSON, getAllByText} = render(<ButtonAddMedia label={'labelku'} onPress={handleOnpress} style={{backgroundColor: 'red'}} labelStyle={{color: 'blue'}} />)
        expect(toJSON).toMatchSnapshot()
        expect(getAllByText('labelku')).toHaveLength(1)
    })
})