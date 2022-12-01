import * as React from 'react'
import {render, cleanup, fireEvent} from '@testing-library/react-native'
import Header from '../../../src/screens/FeedScreen/Header'
import Store from '../../../src/context/Store'

jest.mock('react-native-activity-feed/node_modules/react-native-image-crop-picker', () => ({
    openPicker: () => jest.fn()
}))

describe('Header feed should run correctly', () => {
    it('code should not change', () => {
        const {toJSON} = render(<Header props={{anonimity: false}}  />, {wrapper: Store})
        expect(toJSON).toMatchSnapshot()
    })

    it('user normal should choose correct component', () => {
        const {getAllByTestId} = render(<Header props={{anonimity: false}}  />, {wrapper: Store})
        expect(getAllByTestId('defaultHeader')).toHaveLength(1)

    })

})