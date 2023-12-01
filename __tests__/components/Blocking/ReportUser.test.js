import React from 'react';
import {render} from '@testing-library/react-native';
import ReportUser from '../../../src/components/Blocking/ReportPostAnonymous';

describe('ReportUSer should run correctly', () => {
  it('should match snapshot', () => {
    const ref = jest.fn();
    const onSelect = jest.fn();
    const onSkip = jest.fn();
    const {toJSON} = render(
      <ReportUser refReportPostAnonymous={ref} onSelect={onSelect} onSkip={onSkip} />
    );
    expect(toJSON).toMatchSnapshot();
  });
});
