import React from 'react'
import {render, act, fireEvent} from '@testing-library/react-native'
import Header from '../../../src/screens/GroupInfo/elements/Header'
import { trimString } from '../../../src/utils/string/TrimString';

const mockGoback = jest.fn()

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ goBack: mockGoback}),
}));

describe('it header groupInfo should run correctly', () => {
    it('headerGroupInfo should match snapshot', () => {
        const {toJSON} = render(<Header title={'test'} />)
        expect(toJSON).toMatchSnapshot()
    })

    it('title should on the document', () => {
        const {getByTestId} = render(<Header title={'test'} />)
        expect(getByTestId('title').props.children).toEqual(trimString('test', 21))
        
    })

    it('onBack should run correctly', () => {
         const {getByTestId} = render(<Header title={'test'} />)
        act(() => {
            fireEvent.press(getByTestId('onBack'))
        })
        expect(mockGoback).toHaveBeenCalled()
    })
})