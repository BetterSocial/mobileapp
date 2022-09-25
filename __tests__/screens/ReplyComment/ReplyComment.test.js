import React from 'react'
import {render} from '@testing-library/react-native'
import {act, renderHook} from '@testing-library/react-hooks'
import ReplyComment from '../../../src/screens/ReplyComment'
import useReplyComment from '../../../src/components/ReplyComment/hooks/useReplyComment'

const itemProp = {
    latest_children: {
        comment: [
            {
                activity_id: "bea7567e-38f1-11ed-8bdd-0e4b8d0e7a11",
                updated_at: "2022-09-22T00:20:23.011138Z"

            },
            {
                activity_id: "bea7567e-38f1-11ed-8bdd-0e4b8d0e7a11",
                updated_at: "2022-09-21T00:20:23.011138Z"

            }
        ]
    },
    children_counts: {
        comment: 2
    }
}

describe('it should same as snapshot', () => {
    it('code should not change', () => {
        const spyIntreaction = jest.spyOn(React, 'useRef').mockReturnValueOnce({current: {}})
        const container = render(<ReplyComment />)
        expect(container).toMatchSnapshot()
        expect(spyIntreaction).toHaveBeenCalled()
    })
})

describe('hooks function should run correctly', () => {
    it('should sort date correctly', () => {
        const {result} = renderHook(() => useReplyComment())
        expect(result.current.getThisCommentHook(itemProp)).toStrictEqual([
            {
                activity_id: "bea7567e-38f1-11ed-8bdd-0e4b8d0e7a11",
                updated_at: "2022-09-21T00:20:23.011138Z"

            },
            {
                  activity_id: "bea7567e-38f1-11ed-8bdd-0e4b8d0e7a11",
                updated_at: "2022-09-22T00:20:23.011138Z"

            }
        ])
    })


    it('handle temporary comment should run correctly', () => {
        const {result} = renderHook(() => useReplyComment())
        act(() => {
            result.current.setCommentHook('test')
        })
        expect(result.current.temporaryText).toStrictEqual('test')

    })

    it('isLastInParent should run correctly', () => {
        const {result} = renderHook(() => useReplyComment())
        expect(result.current.isLastInParentHook(1, itemProp)).toStrictEqual(true)
        expect(result.current.isLastInParentHook(0, itemProp)).toStrictEqual(false)
    })

    // it('should update parent reply should run correctly', () => {
    //     const {result} = renderHook(() => useReplyComment())
    //     expect(result.current.updateReplyPostHook("test", itemProp, "bea7567e-38f1-11ed-8bdd-0e4b8d0e7a11").updateComment).toStrictEqual({
    //         latest_children: {
    //         comment: [
    //             {
    //                 activity_id: "bea7567e-38f1-11ed-8bdd-0e4b8d0e7a12",
    //                 updated_at: "2022-09-22T00:20:23.011138Z"

    //             },
    //             {
    //                 activity_id: "bea7567e-38f1-11ed-8bdd-0e4b8d0e7a11",
    //                 updated_at: "2022-09-21T00:20:23.011138Z",
    //                 comment: "test"

    //             }
    //         ]
    // },

    //     })
    // })
})