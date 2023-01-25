import { act, renderHook } from '@testing-library/react-hooks'
import useMedia from '../../src/screens/GroupInfo/elements/useMedia'

describe('useMedia should run correctly', () => {
    it('getSpace should run correctly', async () => {
        const {result} = renderHook(useMedia)
        await result.current.setCount(1)
        expect(result.current.getSpace(0)).toBeTruthy()
        expect(result.current.getSpace(2)).toBeFalsy()
    })
})