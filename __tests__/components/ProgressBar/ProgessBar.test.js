import React from 'react';
import {render} from '@testing-library/react-native';
import {Animated} from 'react-native';
import {ProgressBar} from '../../../src/components/ProgressBar';

describe('Progress Bar should run correctly', () => {
  const mockInterpolate = jest.fn();
  const mockTiming = jest.fn();
  beforeEach(() => {
    jest
      .spyOn(React, 'useRef')
      .mockImplementation(() => ({current: {interpolate: mockInterpolate}}));
    jest.spyOn(Animated, 'timing').mockImplementation(() => ({start: mockTiming}));
  });
  it('should match with snapshot', () => {
    const {toJSON} = render(<ProgressBar />);
    expect(toJSON).toMatchSnapshot();
  });
});
