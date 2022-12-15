import * as React from 'react';
import { render, cleanup } from '@testing-library/react-native';
import TopicLabel from '../../../src/components/Label/TopicPageLabel';


describe('TopicLabel should run correctly', () => {
// value, index, select, onSelect, icon, desc
    afterEach(cleanup)
    it('should match snapshot', () => {
  
        const {toJSON, getAllByText} = render(<TopicLabel label={'test 123'} />)
        expect(toJSON).toMatchSnapshot()
        expect(getAllByText('test 123')).toHaveLength(1)
    })
})