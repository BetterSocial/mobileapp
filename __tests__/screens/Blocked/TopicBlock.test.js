 import React from 'react'
import {render} from '@testing-library/react-native'
import TopicBlock from "../../../src/screens/Blocked/elements/TopicScreen"
 
 describe('Topic Block should run correctly', () => {
    it('should match snapshot', () => {
        const {toJSON} = render(<TopicBlock />)
        expect(toJSON).toMatchSnapshot()
    })
 })