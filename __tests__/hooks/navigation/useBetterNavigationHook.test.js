import { renderHook } from "@testing-library/react-hooks"
import { useNavigation } from "@react-navigation/core"

import useBetterNavigationHook from "../../../src/hooks/navigation/useBetterNavigationHook"
import { NavigationConstants } from "../../../src/utils/constants"

const mockNavigation = jest.fn()
jest.mock('@react-navigation/core', () => ({
    ...jest.requireActual('@react-navigation/core'),
    useNavigation: () => ({
        navigate: mockNavigation
    })
}))

const navigation = useNavigation()
const navigateSpy = jest.spyOn(navigation, 'navigate')

describe('Testing useBetterNavigationHooks', () => {
    it('Testing toCreatePost', () => {
        const { result } = renderHook(() => useBetterNavigationHook())
        const { toCreatePost } = result.current

        toCreatePost()
        expect(navigateSpy).toHaveBeenCalledWith(NavigationConstants.CREATE_POST_SCREEN)
    })

    describe('Testing toCreatePostWithTopic', () => {
        it('Should be called normally with topic', () => {
            const { result } = renderHook(() => useBetterNavigationHook())
            const { toCreatePostWithTopic } = result.current

            toCreatePostWithTopic('TopicName')

            expect(navigateSpy).toHaveBeenCalledWith(NavigationConstants.CREATE_POST_SCREEN, { topic: 'TopicName' })
        })

        it('Should be called normally with topic with additional spaces', () => {
            const { result } = renderHook(() => useBetterNavigationHook())
            const { toCreatePostWithTopic } = result.current

            toCreatePostWithTopic(' TopicName ')

            expect(navigateSpy).toHaveBeenCalledWith(NavigationConstants.CREATE_POST_SCREEN, { topic: 'TopicName' })
        })

        it('Should throw error when topic is undefined', () => {
            const { result } = renderHook(() => useBetterNavigationHook())
            const { toCreatePostWithTopic } = result.current

            expect(() => toCreatePostWithTopic(undefined)).toThrow('topic is undefined')
        })

        it('Should throw error when topic is null', () => {
            const { result } = renderHook(() => useBetterNavigationHook())
            const { toCreatePostWithTopic } = result.current

            expect(() => toCreatePostWithTopic(null)).toThrow('topic is undefined')
        })

        it('Should throw error when topic is empty', () => {
            const { result } = renderHook(() => useBetterNavigationHook())
            const { toCreatePostWithTopic } = result.current

            expect(() => toCreatePostWithTopic([])).toThrow('topic is not a string')
        })

        it('Should throw error when topic is number', () => {
            const { result } = renderHook(() => useBetterNavigationHook())
            const { toCreatePostWithTopic } = result.current

            expect(() => toCreatePostWithTopic(123)).toThrow('topic is not a string')
        })

        it('Should throw error when topic is empty string', () => {
            const { result } = renderHook(() => useBetterNavigationHook())
            const { toCreatePostWithTopic } = result.current

            expect(() => toCreatePostWithTopic('')).toThrow('topic is empty')
        })

        it('Should throw error when topic is empty string with spaces', () => {
            const { result } = renderHook(() => useBetterNavigationHook())
            const { toCreatePostWithTopic } = result.current

            expect(() => toCreatePostWithTopic(' ')).toThrow('topic is empty')
        })
    })
})