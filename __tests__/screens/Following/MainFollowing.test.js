import React from 'react'
import {render} from '@testing-library/react-native'
import FollowingTab from "../../../src/screens/Followings"
import * as useFollowing from '../../../src/screens/Followings/hooks/useFollowing'

jest.mock('@react-navigation/native', () => ({
    useRoute: jest.fn().mockImplementation(() => ({params: {user_id: '123', user_name: 'agita'}}))
}))

describe('Following page should run correctly', () => {
    const setUserId = jest.fn()
    const setUserName = jest.fn()
    beforeEach(() => {
        jest.spyOn(useFollowing, 'default').mockImplementation(() => ({setUserId, setUsername: setUserName}))
    })
    it('Following page should match snapshot', () => {

        const {toJSON} = render(<FollowingTab />)
        expect(toJSON).toMatchSnapshot()
        expect(setUserId).toHaveBeenCalled()
        expect(setUserName).toHaveBeenCalled()
    })
})