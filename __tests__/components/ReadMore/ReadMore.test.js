import React from 'react';
import {render} from '@testing-library/react-native';
import ReadMore from '../../../src/components/ReadMore';
import * as useReadMore from '../../../src/components/ReadMore/hooks/useReadmore';

describe('ReadMore component setup layout should run correctly', () => {
  const mockSetIsFinishLayout = jest.fn();
  beforeEach(() => {
    jest.spyOn(useReadMore, 'default').mockImplementation(() => ({
      isFinishSetLayout: false,
      setIsFinishSetLayout: mockSetIsFinishLayout
    }));
  });

  it('should match with snapshot', () => {
    const {toJSON, getAllByTestId} = render(<ReadMore />);
    expect(toJSON).toMatchSnapshot();
    expect(mockSetIsFinishLayout).toHaveBeenCalled();
    expect(getAllByTestId('notFinishLayout')).toHaveLength(1);
  });
});

describe('ReadMore component finissh layout should run correctly', () => {
  const mockSetIsFinishLayout = jest.fn();
  beforeEach(() => {
    jest.spyOn(useReadMore, 'default').mockImplementation(() => ({
      isFinishSetLayout: true,
      setIsFinishSetLayout: mockSetIsFinishLayout,
      realNumberLine: 5,
      limitNumberLine: 2
    }));
  });

  it('should match with snapshot', () => {
    const {toJSON, getAllByTestId} = render(<ReadMore />);
    expect(toJSON).toMatchSnapshot();
    expect(getAllByTestId('finishLayout')).toHaveLength(1);
    expect(getAllByTestId('moreText')).toHaveLength(1);
  });
});
