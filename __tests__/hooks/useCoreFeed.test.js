import {act, renderHook} from '@testing-library/react-hooks'
import axios from 'axios';

import Store from '../../src/context/Store'
import useCoreFeed from '../../src/screens/FeedScreen/hooks/useCoreFeed'
import {saveToCache} from '../../src/utils/cache'
import {setMainFeeds} from '../../src/context/actions/feeds'

jest.mock('../../src/utils/cache')
jest.mock('../../src/context/actions/feeds')
jest.mock('react-native-safe-area-context', () => {
    const inset = { top: 0, right: 0, bottom: 0, left: 0 }
  return {
    SafeAreaProvider: jest.fn().mockImplementation(({ children }) => children),
    SafeAreaConsumer: jest
      .fn()
      .mockImplementation(({ children }) => children(inset)),
    useSafeAreaInsets: jest.fn().mockImplementation(() => inset),
  }
});

jest.mock('axios')
describe('Main Feed should run correctly', () => {
    it('saveSearchHeight should run correctly', () => {

        const {result} = renderHook(() => useCoreFeed(), { wrapper: Store})

        act(() => {
            result.current.saveSearchHeight('20')
        })
        expect(result.current.searchHeight).toEqual(20)
    })

    it('getDataFeeds should run correctly', async () => {
        const responseMock = {
            data: [
                {
                    anonimity: false,
                    count_downvote: 0,
                    count_upvote: 0,
                    duration_feed: "never",
                    expired_at: "2122-11-04T10:33:48.226Z",
                    final_score: 0,
                    foreign_id: "",
                    id: "2499afe8-6f08-11ed-809a-0a096a1cf185",
                    images_url: "",
                },
            ],
            offset: 10
        }
        // jest.spyOn(axios, 'get').mockResolvedValueOnce({
        //      data: [
        //         {
        //             anonimity: false,
        //             count_downvote: 0,
        //             count_upvote: 0,
        //             duration_feed: "never",
        //             expired_at: "2122-11-04T10:33:48.226Z",
        //             final_score: 0,
        //             foreign_id: "",
        //             id: "2499afe8-6f08-11ed-809a-0a096a1cf185",
        //             images_url: "",
        //         },
        // ],
        // offset: 10
        // })
        // axios.get.mockResolvedValue({
        //     data: [{nama: 'lala'}]
        // })
        const {result} = renderHook(() => useCoreFeed(), { wrapper: Store})
        // act(() => {
        //     result.current.getDataFeeds(10, false)
        // })
        // const spyAxios = jest.spyOn(axios, 'get').mockResolvedValue([{name: 'hehe'}])
        // const {getDataFeeds} = useCoreFeed()
        // const spySaveCache = jest.spyOn('../../src/utils/cache', 'saveToCache')
        axios.get.mockResolvedValue(responseMock)
         const query = `?offset=10`
         act(async() => {
            const resp = await result.current.getDataFeeds(query)
            expect(resp).toEqual(responseMock)
            expect(result.current.postOffset).toEqual(10)
            expect(saveToCache).toHaveBeenCalled(1)
            expect(setMainFeeds).toHaveBeenCalledTimes(1)
         })
        // const feeds = await getMainFeed(query)
        // act(() => {
        //     result.current.getDataFeeds(0, false)
        // })
        // const feeds = await getDataFeeds(10, false)
        // expect(feeds).toEqual([{name: 'hehe'}])
        // expect(result.current.myFeed).toEqual([{name: 'hehe'}])
        // expect(feeds).toEqual(responseMock.data)
        // expect(axios.get).toHaveBeenCalled()
        // expect(spyAxios).toEqual([{name: 'hehe'}])
                    // await result.current.getDataFeeds(10, false)

                    //  expect(result.current.postOffset).toEqual(10)

        // expect(result.current.myFeed).toEqual([])
                

        // await waitForNextUpdate()
        // console.log(result.current.myFeed, 'bolo')
        // expect(result.current.myFeed).toEqual([{ anonimity: false,
        //             count_downvote: 0,
        //             count_upvote: 0,
        //             duration_feed: "never",
        //             expired_at: "2122-11-04T10:33:48.226Z",
        //             final_score: 0,
        //             foreign_id: "",
        //             id: "2499afe8-6f08-11ed-809a-0a096a1cf185",
        //             images_url: "",}])

    })
})