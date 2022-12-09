import { act, renderHook } from '@testing-library/react-hooks'
import Store from '../../src/context/Store';

import useMainPdp from '../../src/screens/PostPageDetail/hooks/useMainPdp'

const mockedGoBack = jest.fn();
const mockedNavigate = jest.fn();

jest.mock('@react-navigation/core', () => ({
      useNavigation:  () => ({
        goBack: mockedGoBack,
        navigate: mockedNavigate
    }),
}))


describe('function should run correctly', () => {
          const props = {
            route: {
                params: {
                    name: 'test pdp',
                    feedId: '123',
                    refreshCache: jest.fn()
                }
            }
        }
    it('navigateToReplyView  should run correctly', () => {
        const updateData = jest.fn()
        const findCommentAndUpdate = jest.fn()
        const updateVoteLasChildren = jest.fn()
        const {result} = renderHook(() => useMainPdp(props), {wrapper: Store})
        act(() => {
            result.current.navigateToReplyView({}, updateData, findCommentAndUpdate, {}, updateVoteLasChildren)
        })
        expect(mockedNavigate).toHaveBeenCalled()
    })
})