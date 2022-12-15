import React from 'react'
import { render, cleanup } from '@testing-library/react-native';
import StatusBar from '../../../src/components/StatusBar'



describe('Statusbar should run correctly', () => {
    afterEach(cleanup)
    it('should match snapshot', () => {
        const {getByTestId} = render(<StatusBar backgroundColor={'red'} />)
        expect(getByTestId('statusbar').props.style).toEqual([{"height": null}, {"backgroundColor": "red"}])
    })
})