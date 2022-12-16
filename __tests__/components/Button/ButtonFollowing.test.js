import * as React from 'react';
import { render, cleanup } from '@testing-library/react-native';
import ButtonFollowing from '../../../src/components/Button/ButtonFollowing';

const mockNavigate = jest.fn()

jest.mock('@react-navigation/core', () => ({
  ...jest.requireActual('@react-navigation/core'),
  useNavigation: () => ({
    goBack: jest.fn(), navigate: mockNavigate 
  }),
}));


describe('ButtonFollowing should run correctly', () => {

    afterEach(cleanup)
    it('should match snapshot', () => {
        const handleUnfollow = jest.fn()
        const {toJSON} = render(<ButtonFollowing handleSetUnFollow={handleUnfollow} />)
        expect(toJSON).toMatchSnapshot()
    })
})