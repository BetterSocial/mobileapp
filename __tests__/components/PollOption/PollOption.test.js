import React from 'react'
import {render, cleanup} from '@testing-library/react-native'

import PollOption, {styles} from '../../../src/components/PollOptions'
import { colors } from '../../../src/utils/colors'
import { COLORS } from '../../../src/utils/theme'

describe('Poll option should run correctly', () => {

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

    const myPoll = {
         polling_option_id: 'c4d16d91-89f5-423c-acb5-95a1b91ec53b'
    }

    const notMyPoll = {
         polling_option_id: '3bc4ec5e-ac8f-4704-8256-1018edd9224c"'
    }

    const maxPolls = ['c4d16d91-89f5-423c-acb5-95a1b91ec53b']
    const notMaxPolls = ['3bc4ec5e-ac8f-4704-8256-1018edd9224c"']

    afterEach(cleanup)

    it('Should match as snapshot', () => {
        const onSelected = jest.fn()
        const {toJSON} = render(<PollOption total={item.voteCount} poll={item.pollOptions[0]} mypoll={myPoll} index={0} selectedindex={0} isexpired={false} isalreadypolling={false} onselected={onSelected} maxpolls={maxPolls} />)
        expect(toJSON).toMatchSnapshot()
    })

    it('renderPercentageBar should run correctly', () => {
        const onSelected = jest.fn()
        const {getAllByTestId} = render(<PollOption total={item.voteCount} poll={item.pollOptions[0]} mypoll={myPoll} index={0} selectedindex={0} isexpired={true} isalreadypolling={false} onselected={onSelected} maxpolls={maxPolls} />)
        expect(getAllByTestId('isExpiredPollOption')).toHaveLength(1)
        const {getAllByTestId: getAlreadyMyPolled} = render(<PollOption total={item.voteCount} poll={item.pollOptions[0]} mypoll={myPoll} index={0} selectedindex={0} isexpired={false} isalreadypolling={true} onselected={onSelected} maxpolls={maxPolls} />)
        expect(getAlreadyMyPolled('isPollNotEndedAndIsMax')).toHaveLength(1)
         const {getAllByTestId: getAlreadyPolled} = render(<PollOption total={item.voteCount} poll={item.pollOptions[0]} mypoll={notMyPoll} index={0} selectedindex={0} isexpired={false} isalreadypolling={true} onselected={onSelected} maxpolls={notMaxPolls} />)
        expect(getAlreadyPolled('isAlreadyPollingOption')).toHaveLength(1)

    })

    it('percentageBar style should correct', () => {
        expect(styles.percentageBar(500)).toEqual({
        "backgroundColor": "#C4C4C4",
        "borderRadius": 6,
        "height": "100%",
        "left": 0,
        "position": "absolute",
        "top": 0,
        "width": "100%",
        })

        expect(styles.percentageBar(undefined)).toEqual({
        "backgroundColor": "#C4C4C4",
        "borderRadius": 6,
        "height": "100%",
        "left": 0,
        "position": "absolute",
        "top": 0,
        "width": "0%",
        })
    })

    it('expiredPercentageBar style should correct', () => {
        expect(styles.expiredPercentageBar(undefined, false)).toEqual({
        "backgroundColor": colors.gray1,
        "borderRadius": 6,
        "height": "100%",
        "left": 0,
        "position": "absolute",
        "top": 0,
        "width": "0%",
        })
        expect(styles.expiredPercentageBar(undefined, true)).toEqual({
        "backgroundColor": COLORS.blueSea,
        "borderRadius": 6,
        "height": "100%",
        "left": 0,
        "position": "absolute",
        "top": 0,
        "width": "0%",
        })

        expect(styles.expiredPercentageBar(200, true)).toEqual({
        "backgroundColor": COLORS.blueSea,
        "borderRadius": 6,
        "height": "100%",
        "left": 0,
        "position": "absolute",
        "top": 0,
        "width": "100%",
        })
    })
})