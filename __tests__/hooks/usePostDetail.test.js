import { act, renderHook } from '@testing-library/react-hooks'
import * as servicePost from '../../src/service/post'
import usePostDetail from '../../src/components/PostPageDetail/hooks/usePostDetail'
import * as usePostDetailAll from '../../src/components/PostPageDetail/hooks/usePostDetail'
import * as contextFeed from '../../src/context/actions/feeds';
import Rn from 'react-native'
import Store, {Context, MockStore} from '../../src/context/Store'
import React from 'react'
import * as creatCommenService from '../../src/service/comment';
import * as serviceVote from '../../src/service/vote'
// const mockKeyboadr = jest.fn()
// jest.mock('react-native', () => ({
//     Keyboard: {
//         dismiss: mockKeyboadr
//     }
// }))

// jest.mock('react-native-config')

jest.mock('react-native-simple-toast', () => ({
    show: jest.fn()
}))

// jest.mock('../../src/components/PostPageDetail/hooks/usePostDetail')

describe('usePollDetail hook should run correctly', () => {
    const mockDispatch = jest.fn()
    // const dispatch = jest.fn()
    //     const state = { users: {} };

    // const wrapper = ({children}) => <Context.Provider value={{state, dispatch}} >{children} </Context.Provider>
    //     const mockUseContext = jest.fn().mockImplementation(() => ({ state, dispatch }));

    // React.useContext = mockUseContext;
    const data = {
        anonimity: false,
            count_downvote: 0,
            count_upvote: 0,
            duration_feed: "1",
            expired_at: "2022-12-08T15:12:53.000Z",
            final_score: 0,
            foreign_id: "",
            id: "9f7f7e87-7641-11ed-82ab-124f97b82f95",
            location: "Everywhere",
            message: "#dia #dian #diam ",
            object: "{\"feed_group\":\"main_feed\",\"message\":\"#dia #dian #diam \",\"profile_pic_path\":\"https://res.cloudinary.com/hpjivutj2/image/upload/v1660620884/nrfnzuhcrozz9v34ngv3.jpg\",\"real_name\":null,\"topics\":[\"dia\",\"dian\"],\"username\":\"Fajarism\",\"verb\":\"tweet\"}",
            origin: null, 
            actor: {
               created_at: "2022-06-10T13:11:53.385703Z",
                id: "c6c91b04-795c-404e-b012-ea28813a2007",
                updated_at: "2022-07-29T12:54:03.879150Z"
            },
            reaction_counts: {
                downvotes: 0,
                upvotes: 1
            }
    }
     const props = {
        dispatch: mockDispatch,
        feedId: '9f7f7e87-7641-11ed-82ab-124f97b82f95',
        feeds: [
            {anonimity: false,
            count_downvote: 0,
            count_upvote: 0,
            duration_feed: "1",
            expired_at: "2022-12-08T15:12:53.000Z",
            final_score: 0,
            foreign_id: "",
            id: "9f7f7e87-7641-11ed-82ab-124f97b82f95",
            location: "Everywhere",
            message: "#dia #dian #diam ",
            object: "{\"feed_group\":\"main_feed\",\"message\":\"#dia #dian #diam \",\"profile_pic_path\":\"https://res.cloudinary.com/hpjivutj2/image/upload/v1660620884/nrfnzuhcrozz9v34ngv3.jpg\",\"real_name\":null,\"topics\":[\"dia\",\"dian\"],\"username\":\"Fajarism\",\"verb\":\"tweet\"}",
            origin: null, 
            actor: {
               created_at: "2022-06-10T13:11:53.385703Z",
                id: "c6c91b04-795c-404e-b012-ea28813a2007",
                updated_at: "2022-07-29T12:54:03.879150Z"
            },
            reaction_counts: {
                downvotes: 0,
                upvotes: 1
            }
            }
        ],
        navigateToReplyView: jest.fn(),
        page: "PostDetailPage",
        setFeedByIndexProps: jest.fn(),
        route: {
            params: {
                isCaching: false
            }
        }
    }

     const cachingProps = {
        dispatch: mockDispatch,
        feedId: '9f7f7e87-7641-11ed-82ab-124f97b82f95',
        feeds: [
            {anonimity: false,
            count_downvote: 0,
            count_upvote: 0,
            duration_feed: "1",
            expired_at: "2022-12-08T15:12:53.000Z",
            final_score: 0,
            foreign_id: "",
            id: "9f7f7e87-7641-11ed-82ab-124f97b82f95",
            location: "Everywhere",
            message: "#dia #dian #diam ",
            object: "{\"feed_group\":\"main_feed\",\"message\":\"#dia #dian #diam \",\"profile_pic_path\":\"https://res.cloudinary.com/hpjivutj2/image/upload/v1660620884/nrfnzuhcrozz9v34ngv3.jpg\",\"real_name\":null,\"topics\":[\"dia\",\"dian\"],\"username\":\"Fajarism\",\"verb\":\"tweet\"}",
            origin: null, 
            actor: {
               created_at: "2022-06-10T13:11:53.385703Z",
                id: "c6c91b04-795c-404e-b012-ea28813a2007",
                updated_at: "2022-07-29T12:54:03.879150Z"
            },
            reaction_counts: {
                downvotes: 0,
                upvotes: 1
            }
            }
        ],
        navigateToReplyView: jest.fn(),
        page: "PostDetailPage",
        setFeedByIndexProps: jest.fn(),
        route: {
            params: {
                isCaching: true,
                data
            }
        }
    }

    const userId = '3c1c081a-2a23-4dad-8dfb-25b12184a7be'
    const myActivity = {
        activity_id: "5aecccee-71d7-11ed-8b9b-12946de4e4d9",
        created_at: "2022-12-13T01:44:28.094190Z",
        duration: "5.89ms",
        id: "3c1c081a-2a23-4dad-8dfb-25b12184a7be",
        kind: "comment",
        parent: "",
        updated_at: "2022-12-13T01:46:50.918023Z",
        user_id: "c6c91b04-795c-404e-b012-ea28813a2006"
    }
    const commentList = [myActivity]
    it('handleVote should run correctly', () => {
        const {result} = renderHook(() => usePostDetail(props), {wrapper: Store})
        act(() => {
            result.current.handleVote({upvotes: 1, downvotes: 1})
        })
        expect(result.current.totalVote).toEqual(0)
    })

    // it('initial function should run correcly', () => {
    //             const {result} = renderHook(() => usePostDetail(props), {wrapper: Store})
    //             act(() => {
    //                 result.current.initial()
    //             })
    //             expect(result.current.totalVote).toEqual(-1)

    // })

    it('getFeedDetail should run correctly', async () => {
         const {result} = renderHook(() => usePostDetail(props), {wrapper: Store})
         const spyGetFeed = jest.spyOn(servicePost, 'getFeedDetail')
        //  const spyUseState = jest.spyOn(React, 'useState').mockImplementation((init) => [init, setState])
         act(() => {
            result.current.getDetailFeed()
         })
        //  expect(spyUseState).toHaveBeenCalled()
        expect(result.current.loading).toBeTruthy()
        expect(spyGetFeed).toHaveBeenCalled()
        // const {result: resultWithDtaParam} = renderHook(() => usePostDetail(cachingProps), {wrapper: Store})
        // act(() => {
        //     resultWithDtaParam.current.getDetailFeed()
        // })
        // expect(result.current.item).toEqual(data)
        //  await waitFor(() => expect(spyUseState).toHaveBeenCalled())
    })

    it('updateParentPost function should run correctly', () => {
        const {result} = renderHook(() => usePostDetail(props), {wrapper: Store})
        // const mockUpdateAllContent = jest.fn()
        // const spyUpdateResult = jest.spyOn(usePostDetailAll, 'usePostDetail').mockImplementation(() => ({updateAllContent: mockUpdateAllContent}))
        act(() => {
            result.current.updateParentPost(data)
        })
        expect(result.current.item).toEqual({...data})

    })

    it('updateAllContent should run correctly', async () => {
        // const {result} = renderHook(() => usePostDetail(cachingProps), {wrapper: Store})
        // await result.current.setItem(data)
        // const spyAction = jest.spyOn(contextFeed, 'setMainFeeds')
        // // act(() => {
        // //     result.current.updateAllContent(data)
        // // })
        // expect(spyAction).toHaveBeenCalled()
    })

    it('updateFeed should run correctly', () => {
        const {result} = renderHook(() => usePostDetail(props), {wrapper: Store})
        const spyGetFeed = jest.spyOn(servicePost, 'getFeedDetail')
        act(() => {
            result.current.updateFeed(true)
        })
        expect(spyGetFeed).toHaveBeenCalled()
    })

    it('onComment should run correctly', () => {
        const {result} = renderHook(() => usePostDetail(props), {wrapper: Store})
        
        // const commentParent = jest.fn()
        // const spy = jest.spyOn(usePostDetailAll, 'usePostDetail').mockImplementation(() => ({commentParent}))
        // act(() => {
        //     result.current.onComment()
        // })
        // expect(commentParent).toHaveBeenCalled()

    })

    it('commentParent should run correctly', async () => {
        const {result} = renderHook(() => usePostDetail(cachingProps), {wrapper: Store})
        const spy = jest.spyOn(creatCommenService, 'createCommentParent')
        // await result.current.setItem(data)
        // await result.current.setTextComment('test halo')
        // expect(spy).toHaveBeenCalled()
    })
    
    it('updateCachingComment should run correctly', () => {
        const {result} = renderHook(() => usePostDetail(props), {wrapper: Store})
        act(() => {
            result.current.updateCachingComment()
        })

    })

    it('commentParent should run correctly', async () => {
        const {result} = renderHook(() => usePostDetail(cachingProps), {wrapper: Store})
        await result.current.setTextComment('test halo')
        await result.current.setItem(data)
        expect(result.current.textComment).toEqual('test halo')
        const spy = jest.spyOn(creatCommenService, 'createCommentParent')
        await result.current.commentParent()
        expect(spy).toHaveBeenCalled()
      
    })

    it('setDownVote should run correctly', async () => {
        const {result} = renderHook(() => usePostDetail(cachingProps), {wrapper: Store})
        const downvote = jest.spyOn(serviceVote, 'downVote')
        await result.current.setItem(data)
         await   result.current.setDownVote(true)
        expect(downvote).toHaveBeenCalled()

    })

    it('setUpVote should run correctly', async () => {
        const {result} = renderHook(() => usePostDetail(cachingProps), {wrapper: Store})
        const upvote = jest.spyOn(serviceVote, 'upVote')
        await result.current.setItem(data)
        await result.current.setUpVote(true)
        expect(upvote).toHaveBeenCalled()
    })

    it('onPressDownVoteHandle should run correctly', async () => {
        const {result} = renderHook(() => usePostDetail(cachingProps), {wrapper: Store})
        await result.current.setItem(data)
        await result.current.onPressDownVoteHandle()
        expect(result.current.voteStatus).toEqual('downvote')
        expect(result.current.totalVote).toEqual(-1)
        await result.current.onPressDownVoteHandle()
        expect(result.current.voteStatus).toEqual('none')
        expect(result.current.totalVote).toEqual(0)
        await result.current.setVoteStatus('upvote')
        await result.current.onPressDownVoteHandle()
        expect(result.current.voteStatus).toEqual('downvote')
        expect(result.current.totalVote).toEqual(-2)

    })

    it('onPressUpvoteHandle should run correctly', async () => {
        const {result} = renderHook(() => usePostDetail(cachingProps), {wrapper: Store})
        await result.current.setItem(data)
        await result.current.onPressUpvoteHandle()
        expect(result.current.voteStatus).toEqual('upvote')
        expect(result.current.totalVote).toEqual(1)
        await result.current.onPressUpvoteHandle()
        expect(result.current.voteStatus).toEqual('none')
        expect(result.current.totalVote).toEqual(0)
        await result.current.setVoteStatus('downvote')
        await result.current.onPressUpvoteHandle()
        expect(result.current.voteStatus).toEqual('upvote')
        expect(result.current.totalVote).toEqual(2)

    })

    it('onCommentButtonClicked should run correctly', async () => {
        const {result} = renderHook(() => usePostDetail(cachingProps), {wrapper: Store})
        // const mock = jest.fn()
        //  const spy = jest.spyOn(usePostDetailAll, 'default')
        //  spy.mockReturnValue({
        //     scrollViewRef: {
        //         current: mock
        //     }
        //  })
        // // const spy = jest.spyOn(usePostDetailAll, 'usePostDetail').mockReturnValue({scrollViewRef: {current: mock}})
        // await result.current.onCommentButtonClicked()
        
        // expect(mock).toHaveBeenCalled()

    })

    it('handleRefreshComment should run correctly', async () => {
        const {result} = renderHook(() => usePostDetail(cachingProps), {wrapper: Store})
        //         const spy = jest.spyOn(result.current, 'updateFeed')
        // act(() => {
        //      result.current.handleRefreshComment()
        // })

        // expect(spy).toHaveBeenCalled()
    })

    it('findCommentAndUpdate should run correctly', () => {})
})