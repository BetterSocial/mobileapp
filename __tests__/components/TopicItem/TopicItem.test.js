import React from 'react'
import { render, cleanup, fireEvent } from '@testing-library/react-native';
import TopicItem from '../../../src/components/TopicItem'


jest.mock('react-native/Libraries/Pressability/usePressability')


describe('TopicItem should run correctly', () => {

    afterEach(cleanup)

    it('should match snapshot', () => {
        const onRemoveTopic = jest.fn()
        const onTopicPress = jest.fn()
        const {getAllByText, getByTestId} = render(<TopicItem label={'test'} removeTopic={onRemoveTopic} onTopicPress={onTopicPress} />)
        expect(getAllByText('test')).toHaveLength(1)
        fireEvent.press(getByTestId('topicPress'))
        expect(onTopicPress).toHaveBeenCalled()
        fireEvent.press(getByTestId('removeTopic'))
        expect(onRemoveTopic).toHaveBeenCalled()
    })
})