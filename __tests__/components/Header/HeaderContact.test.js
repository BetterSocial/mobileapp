import * as React from 'react';
import { render, cleanup } from '@testing-library/react-native';
import HeaderContact from '../../../src/components/Header/HeaderContact';


describe('HeaderContact should run correctly', () => {


    afterEach(cleanup)
    it('should match snapshot', () => {
        const onPress = jest.fn()
        const onPressSub = jest.fn()
        const {toJSON} = render(<HeaderContact title={'test'} subTitle='test header contact' onPress={onPress} onPressSub={onPressSub} />)
        expect(toJSON).toMatchSnapshot()
    })
})