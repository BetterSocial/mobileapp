import { filterAllTopics } from "../../src/utils/Utils"

describe('testing filter all topics', () => {
    it('testing topic only in text', () => {
        const text = `Hi this is hashtag in text only #Black #Hispanics`
        const topics = []
        const result = filterAllTopics(text, topics)
        expect(result.length).toBe(2)
        expect(result[0]).toBe('Black')
        expect(result[1]).toBe('Hispanics')
    })

    it('testing topics only in topics bar', () => {
        const text = ``
        const topics = ['Black', 'Hispanics']
        const result = filterAllTopics(text, topics)
        expect(result.length).toBe(2)
        expect(result[0]).toBe('Black')
        expect(result[1]).toBe('Hispanics')
    })

    it('testing topics both on topics bar and text', () => {
        const text = `Hi this is hashtag in text only #Black #Hispanics`
        const topics = ['Black', 'Veteran', 'Military']
        const result = filterAllTopics(text, topics)
        expect(result.length).toBe(4)
        expect(result[0]).toBe('Black')
        expect(result[1]).toBe('Hispanics')
        expect(result[2]).toBe('Veteran')
        expect(result[3]).toBe('Military')
    })

    it('testing dash topics', () => {
        const text = `Hi this is hashtag in text only #hi-there #Hispanics`
        const topics = ['whats-up']
        const result = filterAllTopics(text, topics)
        expect(result.length).toBe(3)
        expect(result[0]).toBe('hi-there')
        expect(result[1]).toBe('Hispanics')
        expect(result[2]).toBe('whats-up')
    })
})
