import * as React from 'react';
import { render, cleanup } from '@testing-library/react-native';
import ButtonFollow from '../../../src/components/Button/ButtonFollow';

const mockNavigate = jest.fn()

jest.mock('@react-navigation/core', () => ({
  ...jest.requireActual('@react-navigation/core'),
  useNavigation: () => ({
    goBack: jest.fn(), navigate: mockNavigate 
  }),
}));


describe('ButtonFollow should run correctly', () => {

    afterEach(cleanup)
    it('should match snapshot', () => {
        const handleUnfollow = jest.fn()
        const {toJSON} = render(<ButtonFollow handleSetUnFollow={handleUnfollow} />)
        expect(toJSON).toMatchSnapshot()
    })
})