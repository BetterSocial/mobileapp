import * as React from 'react'
import renderer from 'react-test-renderer'

import Label from '../../../src/screens/WhotoFollow/elements/Label'

describe('Label render correctly', () => {
    it('Match snapshot', () => {
        const tree = renderer.create(<Label label='#Veterans' />).toJSON()
        expect(tree).toMatchSnapshot()    
    })
})