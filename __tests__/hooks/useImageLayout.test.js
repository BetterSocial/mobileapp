import { act, renderHook } from '@testing-library/react-hooks'
import useImageLayout from '../../src/screens/FeedScreen/hooks/useImageLayout'

describe('useImageLayout should run correctly', () => {
    it('handleImageWidth should run correctly', () => {
        const {result} = renderHook(() => useImageLayout())
        expect(result.current.handleImageWidth(['https://detik.jpg'], 0)).toEqual({ height: '100%',width: '100%'})
        expect(result.current.handleImageWidth(['https://detik.jpg', 'https://detik2.jpg'], 0)).toEqual({ height: '100%',width: '50%'})

        expect(result.current.handleImageWidth(['https://detik.jpg', 'https://detik2.jpg','https://detik.jpg', 'https://detik2.jpg'], 0)).toEqual({ height: '50%',width: '50%'})
        expect(result.current.handleImageWidth(['https://detik.jpg', 'https://detik2.jpg','https://detik.jpg'], 2)).toEqual({ height: '50%',width: '100%'})
        expect(result.current.handleImageWidth(['https://detik.jpg', 'https://detik2.jpg','https://detik.jpg'], 1)).toEqual({ height: '50%',width: '50%'})


    })
})