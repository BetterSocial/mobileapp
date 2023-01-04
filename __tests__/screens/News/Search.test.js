import React from 'react'
import {render, cleanup, fireEvent} from '@testing-library/react-native'
import Search from '../../../src/screens/NewsScreen/Search'

jest.mock('react-native/Libraries/Pressability/usePressability')
const mockPush = jest.fn()

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ goBack: jest.fn(), push: mockPush }),
  useRoute: () => ({
    params: {}
  }),
}));
describe('News search should run correctly', () => {
    afterEach(cleanup)
    it('Should match snapshot', () => {
        const {toJSON} = render(<Search  />)
        expect(toJSON).toMatchSnapshot()

    })

    it('containerPress should run correctly', () => {
    const {getByTestId} = render(<Search  />)
    fireEvent.press(getByTestId('containerPress'))
    expect(mockPush).toHaveBeenCalled()         
    })
})