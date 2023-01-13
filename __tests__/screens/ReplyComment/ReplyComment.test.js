import React from 'react'
import {render} from '@testing-library/react-native'
import ReplyComment from '../../../src/screens/ReplyComment'

const mockGoBack = jest.fn()
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ goBack: mockGoBack, push: jest.fn() }),
  useRoute: () => ({
    params: {}
  }),
}));





describe('it should same as snapshot', () => {
    it('code should not change', () => {
        const spyIntreaction = jest.spyOn(React, 'useRef').mockReturnValueOnce({current: {}})
        const container = render(<ReplyComment />)
        expect(container).toMatchSnapshot()
        expect(spyIntreaction).toHaveBeenCalled()
    })
})



