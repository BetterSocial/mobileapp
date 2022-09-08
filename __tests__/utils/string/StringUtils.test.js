import { displayCityName } from "../../../src/utils/string/StringUtils"

describe('Testing String Utils', () => {
    describe('Testing displayCityName', () => {
        it('Throws error if no param is provided', () => {
            expect(() => displayCityName()).toThrowError()
        })

        it('Throws error if city param is provided null', () => {
            expect(() => displayCityName(null)).toThrowError('City must be defined')
        })

        it('Throws error if city is provided undefined', () => {
            expect(() => displayCityName(undefined)).toThrowError('City must be defined')
        })

        it('Throws error if city is provided empty string', () => {
            expect(() => displayCityName('')).toThrowError('City must be defined')
        })

        it('Throws error if state param is provided null', () => {
            expect(() => displayCityName('Adjuntas, PR', null)).toThrowError('State must be defined')
        })

        it('Throws error if state param is provided undefined', () => {
            expect(() => displayCityName('Adjuntas, PR', undefined)).toThrowError('State must be defined')
        })

        it('Throws error if state param is provided empty string', () => {
            expect(() => displayCityName('Adjuntas, PR', '')).toThrowError('State must be defined')
        })

        it('Returns city and states from city only', () => {
            expect(displayCityName('Adjuntas, PR', 'Puerto Rico')).toBe('Adjuntas, PR')
        })

        it('Returns city and states from both', () => {
            expect(displayCityName('Adjuntas', 'Puerto Rico')).toBe('Adjuntas, Puerto Rico')
        })
    })
})