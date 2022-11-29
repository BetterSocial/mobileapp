import {act, renderHook} from '@testing-library/react-hooks'
import axios from 'axios';

import Store from '../../src/context/Store'
import useCoreFeed from '../../src/screens/FeedScreen/hooks/useCoreFeed'
import {saveToCache, getSpecificCache} from '../../src/utils/cache'
import {setMainFeeds, setTimer} from '../../src/context/actions/feeds'

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
    it('saveSearchHeight should run correctly', () => {

        const {result} = renderHook(() => useCoreFeed(), { wrapper: Store})

        act(() => {
            result.current.saveSearchHeight('20')
        })
        expect(result.current.searchHeight).toEqual(20)
    })

    it('getDataFeeds should run correctly', async () => {
        
        const {result} = renderHook(() => useCoreFeed(), { wrapper: Store})
        axios.get.mockResolvedValue(responseMock)
         const query = `?offset=20`
         act(async() => {
            const resp = await result.current.getDataFeeds(query)
            expect(resp).toEqual(responseMock)
            expect(result.current.postOffset).toEqual(20)
            expect(saveToCache).toHaveBeenCalled(1)
            expect(setMainFeeds).toHaveBeenCalledTimes(1)
            expect(setTimer).toHaveBeenCalled(1)
         })
     

    })
    it('checkCacheFeed should run correctly', () => {
        const {result} = renderHook(() => useCoreFeed(), { wrapper: Store})
        act(async() => {
            await result.current.checkCacheFeed()
            expect(getSpecificCache).toHaveBeenCalled(1)
        })
    })

    it('onBlockCompleted should run correctly', () => {
        const {result} = renderHook(() => useCoreFeed(), { wrapper: Store})
        axios.get.mockResolvedValue(responseMock)
        act(async() => {
            const resp = await result.current.onBlockCompleted()
            expect(resp).toEqual(responseMock)
            expect(setMainFeeds).toHaveBeenCalled(1)
        })

    })
})