

import * as React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react-native';

import TopicChip from '../../../src/components/TopicsChip/TopicsChip'

const mockedNavigate = jest.fn()
jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: mockedNavigate,
    }),
  }));

describe('It should be run correctly', () => {
    const topics = ['#barusaja', '#yogyakarta']

    afterEach(cleanup)

    it('should match snapshot', () => {
        const {toJSON} = render(<TopicChip topics={topics} />)
        expect(toJSON).toMatchSnapshot()
    })

    it('onPress chip should open navigation', () => {
        const {getAllByTestId} = render(<TopicChip topics={topics} />)
        fireEvent.press(getAllByTestId('topic-chip')[0])
        expect(mockedNavigate).toHaveBeenCalled()
    })
})