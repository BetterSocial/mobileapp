
import React from 'react'
import {render} from '@testing-library/react-native'
import BlockedDomain from "../../../src/screens/Blocked/elements/DomainScreen"

describe('Block domain should run correctly', () => {
    it('should match snapshot', () => {
                const navigation = {
            navigate: jest.fn(),
            setOptions: jest.fn()
        }
        const {toJSON} = render(<BlockedDomain navigation={navigation} />)
        expect(toJSON).toMatchSnapshot()
    })
})