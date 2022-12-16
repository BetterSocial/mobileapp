import React from 'react'
import { render, cleanup, fireEvent } from '@testing-library/react-native';
import DummyLogin from '../../../src/components/DevDummyLogin'
import Store from '../../../src/context/Store';
import * as actionUser from '../../../src/context/actions/users';

const mockNavigate = jest.fn()
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ goBack: jest.fn(), navigate: mockNavigate}),
  useRoute: () => ({
    params: {}
  }),
}));

describe('DummyLogin should run correctly', () => {
    afterEach(cleanup)
    it('should match snapshot', () => {    
        const reset = jest.fn() 
        const {toJSON} = render(<DummyLogin resetClickTime={reset} />, {wrapper: Store})
        expect(toJSON).toMatchSnapshot()
    })

    it('closeDummy login should run correctly', () => {
        const reset = jest.fn() 
        const {getByTestId} = render(<DummyLogin resetClickTime={reset} />, {wrapper: Store})
        fireEvent.press(getByTestId('closedemo'))
        expect(reset).toHaveBeenCalled()
    })

    it('dummyOnBoarding should run correctly', () => {
        const reset = jest.fn() 
        const spyHumanId = jest.spyOn(actionUser, 'setDataHumenId')
        const {getByTestId} = render(<DummyLogin resetClickTime={reset} />, {wrapper: Store})
        fireEvent.press(getByTestId('dummyonboarding'))
        expect(spyHumanId).toHaveBeenCalled()
        expect(mockNavigate).toHaveBeenCalled()
    })
})