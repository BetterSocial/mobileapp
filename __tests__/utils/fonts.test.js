import {normalize, normalizeFontSize} from '../../src/utils/fonts'


jest.mock('react-native', () => ({
    Dimensions: {
        get: jest.fn().mockReturnValue({width: 300, height: 300})
    },
    PixelRatio: {
        roundToNearestPixel: jest.fn().mockReturnValue(20)
    },
    Platform: {
        OS: jest.fn().mockReturnValue('ios')
    }
}))

describe('Util font should correct', () => {
    it('normalize should run correctly', () => {
        expect(normalize(10)).toEqual(9)
    })

   it('normalizeFontSize should run correctly', () => {
        expect(normalizeFontSize(14)).toEqual(12.600000000000001)

   })
})