/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
import { act, renderHook } from '@testing-library/react-hooks'
import * as reactString from 'react-string-replace'
import * as serviceToken from '../../src/utils/token';
import useContentFeed from '../../src/screens/FeedScreen/hooks/useContentFeed'
import { colors } from '../../src/utils/colors';

// // const mockReactString = jest.fn()
// jest.mock('react-string-replace', () => ({
//     default: jest.fn()
// }))

describe('it should run correctly', () => {

    beforeEach(() => {
        jest.spyOn(reactString, 'default')
    })

    it('matchPress should fun correctly', () => {
        const navigation = {
            push: jest.fn()
        }
        const spyGetUserId = jest.spyOn(serviceToken, 'getUserId').mockImplementation(() => Promise.resolve())
        const {result} = renderHook(() => useContentFeed({navigation}))
        act(() => {
            result.current.matchPress('#black')
        })
        expect(navigation.push).toHaveBeenCalled()
        act(() => {
            result.current.matchPress('@agita')
        })
        expect(spyGetUserId).toHaveBeenCalled()
        expect(navigation.push).toHaveBeenCalled()
    })
    
    it('hashtagAtComponent should run correctly', async () => {
        const navigation = {
            push: jest.fn()
        }
        const {result} = renderHook(() => useContentFeed({navigation}))
        expect(result.current.hashtagAtComponent('#Human @agita')[1].props.children).toEqual("#Human")
        expect(result.current.hashtagAtComponent('#Human @agita')[1].props.style).toEqual({color: colors.blue})
        expect(result.current.hashtagAtComponent('#Human @agita')[3].props.children).toEqual("@agita")

    })
})