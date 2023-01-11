import React from 'react'
import {Linking} from 'react-native'
import {render, cleanup, fireEvent} from '@testing-library/react-native'
import Content from '../../../src/screens/NewsScreen/Content'


jest.mock('react-native/Libraries/Pressability/usePressability')
const mockPush = jest.fn()
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ goBack: jest.fn(), push: mockPush }),
  useRoute: () => ({
    params: {}
  }),
}));

describe('Content news should run correctly', () => {
    afterEach(cleanup)
    it('should match snapshot', () => {
        const {toJSON} = render(<Content />)
        expect(toJSON).toMatchSnapshot()
    })

    it('function textPress should run correctly', () => {
       const spy = jest.spyOn(Linking, 'openURL')
        const {getByTestId} = render(<Content />)
        fireEvent.press(getByTestId('textPress'))
        expect(spy).toHaveBeenCalled()
        
    })

    it('function onContentPressed should run correctly', () => {
        const onContentPressedMock = jest.fn()
         const {getByTestId} = render(<Content />)
         fireEvent.press(getByTestId('press'))
         expect(mockPush).toHaveBeenCalled()
         const {getByTestId:getWithMock} = render(<Content onContentClicked={onContentPressedMock} />)
         fireEvent.press(getWithMock('press'))
         expect(onContentPressedMock).toHaveBeenCalled()
    })

})