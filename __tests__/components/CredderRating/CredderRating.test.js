import * as React from 'react';
import renderer from 'react-test-renderer';
import {cleanup, render} from '@testing-library/react-native';

import CredderRating from '../../../src/components/CredderRating/CredderRating';

jest.useFakeTimers();

describe('Credder Rating testing', () => {
  afterEach(cleanup);
  it('should match snapshot', () => {
    const {toJSON} = renderer.create(<CredderRating score={90} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render green icon if score is greater than 65', () => {
    const {getByTestId, getByText} = render(<CredderRating score={90} />);
    expect(getByTestId('credder-rating-green')).toBeTruthy();
    expect(getByText('90%')).toBeTruthy();
  });

  it('should render grey icon if score is not set or less than 0', () => {
    const {getByTestId, getByText} = render(<CredderRating score={-1} />);
    expect(getByTestId('credder-rating-grey')).toBeTruthy();
    expect(getByText('n/a')).toBeTruthy();
  });

  it('should render red icon if score is 0 or less than 35', () => {
    const {getByTestId, getByText} = render(<CredderRating score={0} />);
    expect(getByTestId('credder-rating-red')).toBeTruthy();
    expect(getByText('0%')).toBeTruthy();
  });

  it('should render yellow icon if score is greater than 35 or less than 65', () => {
    const {getByTestId, getByText} = render(<CredderRating score={65} />);
    expect(getByTestId('credder-rating-yellow')).toBeTruthy();
    expect(getByText('65%')).toBeTruthy();
  });
});
