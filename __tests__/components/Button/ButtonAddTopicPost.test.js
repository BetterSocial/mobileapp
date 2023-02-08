import * as React from 'react';
import { render } from '@testing-library/react-native';

import ButtonAddPostTopic from '../../../src/components/Button/ButtonAddPostTopic';

describe('Testing Button Add Topic Post', () => {
    it('should match snapshot', () => {
        const { toJSON } = render(<ButtonAddPostTopic />)
        expect(toJSON()).toMatchSnapshot()
    })
})