import * as React from 'react';
import { render, cleanup } from '@testing-library/react-native';
import ProfileContact from '../../../src/components/Items/ProfileContact';

jest.mock('react-native/Libraries/Pressability/usePressability')

describe('ProfileContact component should run correctly', () => {
    afterEach(cleanup)

    it('should match snapshot', () => {
        const onPress = jest.fn()
        const {toJSON, getAllByText, getByTestId, getAllByTestId} = render(<ProfileContact photo={'https://image.jpg'} fullname='Agita Firstawan' onPress={onPress} select={true} />)
        expect(toJSON).toMatchSnapshot()
        expect(getAllByText('Agita Firstawan')).toHaveLength(1)
        expect(getByTestId('image').props.source).toEqual({uri: "https://image.jpg"})
        const {getByTestId: getUndefinedPhoto} = render(<ProfileContact fullname='Agita Firstawan' onPress={onPress} select={false} />)
        expect(getUndefinedPhoto('image').props.source).toEqual({uri: undefined})
        expect(getAllByTestId('selected')).toHaveLength(1)
    })
})