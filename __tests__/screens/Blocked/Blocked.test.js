import React from 'react'
import {render} from '@testing-library/react-native'
import BlockedTab from "../../../src/screens/Blocked"
import Store from '../../../src/context/Store'

jest.mock('@react-navigation/native', () => ({
    createNavigatorFactory: jest.fn()
}))

jest.mock('@react-navigation/material-top-tabs', () => ({
    createMaterialTopTabNavigator: jest.fn().mockImplementation(() => ({Navigator: jest.fn()}))
}))

jest.mock('../../../src/hooks/useAfterInteractions', () => ({
    useAfterInteractions: () => ({
        transitionRef: {current: {animateNextTransition: jest.fn()}}, interactionsComplete: true
    })
}))

describe('Blockeg page should run correctly', () => {
    it('Blocked tab hhould match snapshot', () => {
        const mockNavigation = {
            addListener: jest.fn()
        }
        const {toJSON} = render(<BlockedTab navigation={mockNavigation} />, {wrapper: Store})
        expect(toJSON).toMatchSnapshot()
    })
})