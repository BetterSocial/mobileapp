import { fireEvent, render } from '@testing-library/react-native'
import * as React from 'react'
import renderer from 'react-test-renderer'
import { ContextProvider } from 'recyclerlistview'

import TopicText from '../../../src/components/TopicText'
import { Context } from '../../../src/context'
import { feedsState } from '../../../src/context/reducers/FeedReducer'

beforeEach(() => {
    jest.useFakeTimers()
})
describe('Testing Topic Text', () => {
    const navigation = {
        push: jest.fn()
    }
    const text = '#topicPoll'

    it('Match snapshot', () => {
        const dispatch = jest.fn()

        const contextValue = {
            feeds: [feedsState, dispatch]
        }

        const tree = renderer.create(
            <Context.Provider value={contextValue}>
                <TopicText navigation={navigation} text={text} currentTopic={'poll'} />
            </Context.Provider>
        ).toJSON()
        expect(tree).toMatchSnapshot()
    })

    it('Will not navigate when navigation is null', () => {
        const dispatch = jest.fn()

        const contextValue = {
            feeds: [feedsState, dispatch]
        }
        const { getByTestId } = render(
            <Context.Provider value={contextValue}>
                <TopicText text={text} poll={'poll'} />
            </Context.Provider>
        )

        fireEvent.press(getByTestId('topicTextComponent'))
        expect(navigation.push).toBeCalledTimes(0)
    })

    it('Will not navigate when navigation is set and target topic is the same as currentTopic', () => {
        const dispatch = jest.fn()

        const contextValue = {
            feeds: [feedsState, dispatch]
        }
        const { getByTestId } = render(
            <Context.Provider value={contextValue}>
                <TopicText navigation={navigation} text={text} currentTopic={'topicPoll'} />
            </Context.Provider>
        )

        fireEvent.press(getByTestId('topicTextComponent'))
        expect(navigation.push).toBeCalledTimes(0)
    })

    it('Will navigate when navigation is set and target topic is different as currentTopic', () => {
        const dispatch = jest.fn()

        const contextValue = {
            feeds: [feedsState, dispatch]
        }
        const { getByTestId } = render(
            <Context.Provider value={contextValue}>
                <TopicText navigation={navigation} text={text} currentTopic={'poll'} />
            </Context.Provider>
        )
        fireEvent.press(getByTestId('topicTextComponent'))
        expect(navigation.push).toBeCalledTimes(1)
    })
})