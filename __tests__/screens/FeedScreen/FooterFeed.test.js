import {render, cleanup, fireEvent} from '@testing-library/react-native'
import * as React from 'react'
import Footer from '../../../src/screens/FeedScreen/Footer'

jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useRoute: () => jest.fn(),
    useNavigation: () => jest.fn,
}))



describe('Footer Feed component should be correct', () => {

    afterEach(cleanup)

    it('code should not change', () => {
        const {toJSON} = render(<Footer />)
        expect(toJSON).toMatchSnapshot()
    })

    it('icon downvote should be correct', () => {
        const {getAllByTestId} = render(<Footer statusVote='downvote' />)
        expect(getAllByTestId('downvoteOn')).toHaveLength(1)
    })


    it('icon upvote should be correct', () => {
        const {getAllByTestId} = render(<Footer statusVote='upvote' />)
        expect(getAllByTestId('upvoteOn')).toHaveLength(1)
    })

    it('icon no vote should run correctly', () => {
        const {getAllByTestId} = render(<Footer statusVote={'none'} />)
        expect(getAllByTestId('upvoteOff')).toHaveLength(1)
        expect(getAllByTestId('downvoteOff')).toHaveLength(1)

    })

    it('onPressShare should call on press button', () => {
        const onShareFunc = jest.fn()
        const onPressUpvote = jest.fn()
        const onPressDownvote = jest.fn()
        const onComment = jest.fn()
        const onBlock = jest.fn()
        const {getByTestId} = render(<Footer statusVote={'none'} onPressShare={onShareFunc} onPressUpvote={onPressUpvote} onPressBlock={onBlock} onPressComment={onComment} onPressDownVote={onPressDownvote} />)
        fireEvent.press(getByTestId('onShare'))
        expect(onShareFunc).toHaveBeenCalledTimes(1)
        fireEvent.press(getByTestId('onComment'))
        expect(onComment).toHaveBeenCalledTimes(1)
        fireEvent.press(getByTestId('onUpvote'))
        expect(onPressUpvote).toHaveBeenCalledTimes(1)
        fireEvent.press(getByTestId('onDownvote'))
        expect(onPressDownvote).toHaveBeenCalledTimes(1)
        fireEvent.press(getByTestId('onBlock'))
        expect(onBlock).toHaveBeenCalledTimes(1)
    })

})