import React from 'react'
import { Linking } from 'react-native'
import {render, act, fireEvent} from '@testing-library/react-native'
import ItemLink from '../../../src/screens/GroupInfo/elements/ItemLink'
import { trimString } from '../../../src/utils/string/TrimString';

const mockGoback = jest.fn()

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ goBack: mockGoback}),
}));

describe('it ItemLink groupInfo should run correctly', () => {
    it('ItemLink should match snapshot', () => {
        const {toJSON} = render(<ItemLink domain={'detik'} link={'https://detik.com'} title='baru' image={'https://detik.jpg'} />)
        expect(toJSON).toMatchSnapshot()
    })

    it('title and domain should on the document', () => {
        const {getByTestId} = render(<ItemLink  domain={'detik'} link={'https://detik.com'} title='baru' image={'https://detik.jpg'} />)
        expect(getByTestId('title').props.children).toEqual(trimString('baru', 50))
        expect(getByTestId('domain').props.children).toEqual(trimString('detik'))

        
    })

     it('onPress should linking url', () => {
        const spyLink = jest.spyOn(Linking, 'openURL');

        const {getByTestId} = render(<ItemLink  domain={'detik'} link={'https://detik.com'} title='baru' image={'https://detik.jpg'} />)
        
        act(() => {
            fireEvent.press(getByTestId('onPress'))
        })
        expect(spyLink).toHaveBeenCalled()
        
    })
})