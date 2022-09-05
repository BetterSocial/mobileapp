import * as React from 'react'
import renderer from 'react-test-renderer'
import { fireEvent, render } from '@testing-library/react-native'

import TopicText from '../../../src/components/TopicText'

beforeEach(() => {
    jest.useFakeTimers()
})
describe('Testing Topic Text', () => {
    const navigation = {
        push: jest.fn()
    }
    const text = '#topicPoll'

    it('Match snapshot', () => {
        const tree = renderer.create(<TopicText navigation={navigation} text={text} currentTopic={'poll'} />).toJSON()
        expect(tree).toMatchSnapshot()
    })

    it('Will not navigate when navigation is null', () => {
        const { getByTestId } = render(<TopicText text={text} poll={'poll'} />)
        fireEvent.press(getByTestId('topicTextComponent'))
        expect(navigation.push).toBeCalledTimes(0)
    })

    it('Will not navigate when navigation is set and target topic is the same as currentTopic', () => {
        const { getByTestId } = render(<TopicText navigation={navigation} text={text} currentTopic={'topicPoll'} />)
        fireEvent.press(getByTestId('topicTextComponent'))
        expect(navigation.push).toBeCalledTimes(0)
    })

    it('Will navigate when navigation is set and target topic is different as currentTopic', () => {
        const { getByTestId } = render(<TopicText navigation={navigation} text={text} currentTopic={'poll'} />)
        fireEvent.press(getByTestId('topicTextComponent'))
        expect(navigation.push).toBeCalledTimes(1)
    })
})