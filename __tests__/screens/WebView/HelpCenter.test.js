import React from 'react'
import {act, fireEvent, render} from '@testing-library/react-native'

import HelpCenter from '../../../src/screens/WebView/HelpCenter'

jest.mock('../../../src/hooks/useAfterInteractions', () => ({
    useAfterInteractions: () => ({
        transitionRef: {current: {animateNextTransition: jest.fn()}}, interactionsComplete: true
    })
}))
const mockGoBack = jest.fn()
const mockNavigate = jest.fn()
jest.mock('@react-navigation/core', () => ({
  ...jest.requireActual('@react-navigation/core'),
  useNavigation: () => ({ goBack: mockGoBack, navigate: mockNavigate}),
  useRoute: () => ({
    params: {}
  }),
}));
const mockLogScreenView = jest.fn();

jest.mock('@react-native-firebase/analytics', () => () => ({
    logEvent: jest.fn(),
    logLogin: jest.fn(),
    setUserId: jest.fn(),
    logScreenView: mockLogScreenView
  }))

describe('HelpCenter page should run correctly', () => {
    it('should match snapshot',() => {
        const navigation = {
          goBack: jest.fn()
        }
        const {toJSON} = render(<HelpCenter navigation={navigation} />)
        expect(toJSON).toMatchSnapshot()

    })

    it('backButton should navigate back', async () => {
             const navigation = {
          goBack: jest.fn()
        }
         const {getByTestId} = render(<HelpCenter navigation={navigation} />)
         act(() => {
            fireEvent.press(getByTestId('backButton'))
         })
         expect(navigation.goBack).toHaveBeenCalled()
    })
})