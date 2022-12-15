import * as React from 'react';
import { render, cleanup } from '@testing-library/react-native';
import MenuPostItem from '../../../src/components/MenuPostItem';

jest.mock('react-native/Libraries/Pressability/usePressability')

describe('MenuPostItem component should run correctly', () => {
// icon, label, labelStyle, onPress, topic, listTopic
    afterEach(cleanup)

    it('should match snapshot', () => {
        const onPress = jest.fn()
        const {toJSON} = render(<MenuPostItem label={'topik saya'} onPress={onPress} topic={'#topic1'} listTopic={'#topic1, #topic2'} icon={'https://detik.jpg'} />)
        expect(toJSON).toMatchSnapshot()
        const {getAllByTestId: getNoTopic} = render(<MenuPostItem label={'topik saya'} onPress={onPress} topic={null} listTopic={'#topic1, #topic2'} icon={'https://detil.jpg'} />)
        expect(getNoTopic('notopic')).toHaveLength(1)
    })
})