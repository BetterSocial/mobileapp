
import React from 'react'
import {render, cleanup, fireEvent} from '@testing-library/react-native'
import ImageLayout from '../../../src/screens/FeedScreen/elements/ImageLayouter'


jest.mock('react-native/Libraries/Pressability/usePressability')

describe('Image layout should run correctly', () => {
    const images = ['https://detik.jpg']

    afterEach(cleanup)

    it('should same snapshot', () => {
        const {toJSON} = render(<ImageLayout images={images} />)
        expect(toJSON).toMatchSnapshot()
    })

    it('onOMageClick should run correctly', () => {
        const onImageClick = jest.fn()
        const {getByTestId} = render(<ImageLayout onimageclick={onImageClick} images={images} />)
        fireEvent.press(getByTestId('press'))
        expect(onImageClick).toHaveBeenCalled()
    })
})