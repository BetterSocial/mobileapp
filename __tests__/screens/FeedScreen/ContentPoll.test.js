import {render, cleanup, fireEvent} from '@testing-library/react-native'
import * as React from 'react'
import ContentPoll from '../../../src/screens/FeedScreen/ContentPoll'
import { getPollTime } from '../../../src/utils/string/StringUtils'

describe('Content poll should smae as snapshot', () => {
     const item = {
        post_type: 1,
        message: 'halo',
        images_url: '',
        pollOptions: [
            {
                counter: "0",
                createdAt: "2022-11-28T01:24:25.000Z",
                option: "bahaya123",
                polling_id: "dee1ff13-9e1e-46b2-8ffc-46afdd38acca",
                polling_option_id: "c4d16d91-89f5-423c-acb5-95a1b91ec53b",
                updatedAt: "2022-11-28T01:24:25.000Z",
            },
            {
                counter: "1",
                    createdAt: "2022-11-28T01:24:25.000Z",
                    option: "bahaya1",
                    polling_id: "dee1ff13-9e1e-46b2-8ffc-46afdd38acca",
                    polling_option_id: "3bc4ec5e-ac8f-4704-8256-1018edd9224c",
                    updatedAt: "2022-11-28T01:25:15.000Z"
            }
        ],
        polls_expired_at: '2022-11-29T01:24:25.170Z',
        multiplechoice: true,
        isalreadypolling: true,
        voteCount:2,
        topics: ["poll"]
    }

    afterEach(cleanup)

    it('should same as snapshot', () => {
        const  onnewpollfetched = jest.fn()
        const tree = render(<ContentPoll item={item} onnewpollfetched={onnewpollfetched} multiplechoice={item.multiplechoice} pollexpiredat={item.polls_expired_at} voteCount={item.voteCount} isalreadypolling={item.isalreadypolling} polls={item.pollOptions} />).toJSON()
        expect(tree).toMatchSnapshot()
        
        
    })

    it('poll multiplechoice component should be show', () => {
        const  onnewpollfetched = jest.fn()
        const {getAllByTestId, getByTestId} = render(<ContentPoll item={item} onnewpollfetched={onnewpollfetched} multiplechoice={item.multiplechoice} pollexpiredat={item.polls_expired_at} voteCount={item.voteCount} isalreadypolling={item.isalreadypolling} polls={item.pollOptions} />);
        expect(getAllByTestId('multiple')).toHaveLength(2)
    })

        it('poll not multiplechoice component should be show', () => {
        const  onnewpollfetched = jest.fn()
        const {getAllByTestId} = render(<ContentPoll item={item} onnewpollfetched={onnewpollfetched} multiplechoice={false} pollexpiredat={item.polls_expired_at} voteCount={item.voteCount} isalreadypolling={item.isalreadypolling} polls={item.pollOptions} />);
        expect(getAllByTestId('option')).toHaveLength(2)
    })


    it('poll date should be existed', () => {
        const  onnewpollfetched = jest.fn()
        const {getAllByText} = render(<ContentPoll item={item} onnewpollfetched={onnewpollfetched} multiplechoice={false} pollexpiredat={item.polls_expired_at} voteCount={item.voteCount} isalreadypolling={item.isalreadypolling} polls={item.pollOptions} />);
        const polltime = getPollTime(item.polls_expired_at)
        expect(getAllByText(polltime)).toHaveLength(1)
    })

    it('total vote text should be existed', () => {
         const  onnewpollfetched = jest.fn()
        const {getAllByText} = render(<ContentPoll item={item} onnewpollfetched={onnewpollfetched} multiplechoice={false} pollexpiredat={'2022-11-29T01:24:25.170Z'} voteCount={item.voteCount} isalreadypolling={false} polls={item.pollOptions} />);
        expect(getAllByText(`${item.voteCount} votes`)).toHaveLength(1)
    })

})