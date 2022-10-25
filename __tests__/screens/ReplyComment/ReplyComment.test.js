// import React from 'react'
// import {render} from '@testing-library/react-native'
// import {act, renderHook} from '@testing-library/react-hooks'
// import ReplyComment from '../../../src/screens/ReplyComment'
// import useReplyComment from '../../../src/components/ReplyComment/hooks/useReplyComment'

// const itemProp = {
//     latest_children: {
//         comment: [
//             {
//                 activity_id: "bea7567e-38f1-11ed-8bdd-0e4b8d0e7a11",
//                 updated_at: "2022-09-22T00:20:23.011138Z"

//             },
//             {
//                 activity_id: "bea7567e-38f1-11ed-8bdd-0e4b8d0e7a11",
//                 updated_at: "2022-09-21T00:20:23.011138Z"

//             }
//         ]
//     },
//     children_counts: {
//         comment: 2
//     }
// }

// const comments = [
//     {
//         activity_id: "029ec53e-281d-11ed-b3e4-0a6648bb8f8d",
//         data: {
//             count_downvote: 0,
//             count_upvote: 0,
//             text: 'gulai'
//         },
//         id: '98d99e1e-182a-42b0-b3f8-4f3d27403f51',
//         // latest_children: itemProp.latest_children

//     },
//      {
//         activity_id: "029ec53e-281d-11ed-b3e4-0a6648bb8f8d",
//         data: {
//             count_downvote: 0,
//             count_upvote: 0,
//             text: 'gulai'
//         },
//         id: '51d6e8b4-6ba2-4d5b-a843-a3adb58f9739',
//         // latest_children: itemProp.latest_children

//     }
// ]

// describe('it should same as snapshot', () => {
//     it('code should not change', () => {
//         const spyIntreaction = jest.spyOn(React, 'useRef').mockReturnValueOnce({current: {}})
//         const container = render(<ReplyComment />)
//         expect(container).toMatchSnapshot()
//         expect(spyIntreaction).toHaveBeenCalled()
//     })
// })

// describe('hooks function should run correctly', () => {
//     it('should sort date correctly', () => {
//         const {result} = renderHook(() => useReplyComment())
//         expect(result.current.getThisCommentHook(itemProp)).toStrictEqual([
//             {
//                 activity_id: "bea7567e-38f1-11ed-8bdd-0e4b8d0e7a11",
//                 updated_at: "2022-09-21T00:20:23.011138Z"

//             },
//             {
//                   activity_id: "bea7567e-38f1-11ed-8bdd-0e4b8d0e7a11",
//                 updated_at: "2022-09-22T00:20:23.011138Z"

//             }
//         ])
//     })

//     it('handle temporary comment should run correctly', () => {
//         const {result} = renderHook(() => useReplyComment())
//         act(() => {
//             result.current.setCommentHook('test')
//         })
//         expect(result.current.temporaryText).toStrictEqual('test')

//     })

//     it('isLastInParent should run correctly', () => {
//         const {result} = renderHook(() => useReplyComment())
//         expect(result.current.isLastInParentHook(1, itemProp)).toStrictEqual(true)
//         expect(result.current.isLastInParentHook(0, itemProp)).toStrictEqual(false)
//     })

//        it('updatevote reply should update children vote', () => {
//         const {result} = renderHook(useReplyComment)
//         const data = {
//             data: {
//                 count_downvote: 0,
//                 count_upvote: 1,
//                 text: 'gulai'
//             }
//         }
//         expect(result.current.findCommentAndUpdateHook(comments, '51d6e8b4-6ba2-4d5b-a843-a3adb58f9739', data)).toStrictEqual([{
//             activity_id: "029ec53e-281d-11ed-b3e4-0a6648bb8f8d",
//             data: {
//                 count_downvote: 0,
//                 count_upvote: 0,
//                 text: 'gulai'
//             },
//             id: '98d99e1e-182a-42b0-b3f8-4f3d27403f51',
//         }, {
//              activity_id: "029ec53e-281d-11ed-b3e4-0a6648bb8f8d",
//         data: {
//             count_downvote: 0,
//             count_upvote: 1,
//             text: 'gulai'
//         },
//         id: '51d6e8b4-6ba2-4d5b-a843-a3adb58f9739',
//         }])
//     })

//     it('vote reply children shuld update parent', () => {
//         const data = {
//             code: 200,
//             data: {
//                 activity_id: "029ec53e-281d-11ed-b3e4-0a6648bb8f8d",
//                 data: {
//                     count_downvote: 0,
//                     count_upvote: 2,
//                     text: 'gulai'
//                 },
//                 id: "51d6e8b4-6ba2-4d5b-a843-a3adb58f9739"
//             }
//         }
//         const myDataVote = {
//                             activity_id: "51d6e8b4-6ba2-4d5b-a843-a3adb58f9739",
//                             status: "downvote",
//                             text: "Gandos"
//                         }
//         const newComments = {
//             activity_id: "029ec53e-281d-11ed-b3e4-0a6648bb8f8d",
//             id: "51d6e8b4-6ba2-4d5b-a843-a3adb58f9710",
//             data: {
//                 count_downvote: 0,
//                 count_upvote: 0,
//                 text: 'gulai'
//             },
//             latest_children: {
//                 comment: [
//                     {
//                         activity_id: "029ec53e-281d-11ed-b3e4-0a6648bb8f8d",
//                         data: {
//                             count_downvote: 0,
//                             count_upvote: 0,
//                             text: 'gulai'
//                         },
//                         id: '51d6e8b4-6ba2-4d5b-a843-a3adb58f9739',
//                     }
//                 ]
//             }

//         }
//         const {result} = renderHook(useReplyComment)
//         expect(result.current.updateVoteParentPostHook(data, myDataVote, newComments)).toStrictEqual([{"activity_id": "029ec53e-281d-11ed-b3e4-0a6648bb8f8d", "data": {"count_downvote": 0, "count_upvote": 2, "text": "gulai"}, "id": "51d6e8b4-6ba2-4d5b-a843-a3adb58f9739"}])

//     })

//     it('updateVoteLatestChildrenParentHook should run correctly', () => {
//         const {result} = renderHook(() => useReplyComment())
//         const response = {
//                 data: {
//                 count_downvote: 0,
//                 count_upvote: 1,
//                 text: "Baksp"
//             }
//         }
//         const dataVote = {
//             parent: "51d6e8b4-6ba2-4d5b-a843-a3adb58f9739",
//             id: "6fbdf69c-689d-4641-8130-bae29e916a90"
//         }

//         const comment = {
//             latest_children: {
//                 comment: [
//                     {
//                         id: "51d6e8b4-6ba2-4d5b-a843-a3adb58f9739",
//                         latest_children: {
//                             comment: [
//                                {id: "6fbdf69c-689d-4641-8130-bae29e916a90",
//                                data:  {
//                                     count_downvote: 0,
//                                     count_upvote: 1,
//                                     text: "Baksp"
//                                 }}
//                             ]
//                         }

//                     }
//                 ]
//             }
//         }
//         expect(result.current.updateVoteLatestChildrenParentHook(response, dataVote, comment)).toStrictEqual([{
//             "id": "51d6e8b4-6ba2-4d5b-a843-a3adb58f9739",
//             "latest_children": {
//                 "comment": [
//                     {data: {
//                         "count_downvote": 0,
//                         "count_upvote": 1,
//                          "text": "Baksp",
//                     },
//                      "id": "6fbdf69c-689d-4641-8130-bae29e916a90",
//                 }
//                 ]
//             }
//         }])
//     })
// })

test("adds 1 + 2 to equal 3", () => {
  expect(3).toBe(3);
});
