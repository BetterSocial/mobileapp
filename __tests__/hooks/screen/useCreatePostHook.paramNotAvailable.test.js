import { renderHook } from "@testing-library/react-hooks"

import useCreatePostHook from "../../../src/hooks/screen/useCreatePostHook"

jest.mock('@react-navigation/core', () => ({
    ...jest.requireActual('@react-navigation/core'),
    useRoute: () => ({
        params: {}
    })
}))

describe('Testing UseCreatePostHook', () => {
    it('should return headerTitle and initialTopic if provided', () => {
        const { headerTitle, initialTopic } = renderHook(() => useCreatePostHook()).result.current
        expect(headerTitle).toBe('Create Post')
        expect(initialTopic.length).toBe(0)
    })
})