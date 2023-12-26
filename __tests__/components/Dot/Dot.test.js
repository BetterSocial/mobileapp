import * as React from 'react';
import {render, cleanup} from '@testing-library/react-native';
import Dot from '../../../src/components/Dot';
import {COLORS} from '../../../src/utils/theme';

describe('Dot should run correctly', () => {
  afterEach(cleanup);
  it('should match snapshot', () => {
    const {toJSON, getByTestId} = render(<Dot size={5} color="blue" />);
    expect(toJSON).toMatchSnapshot();
    expect(getByTestId('dot').props.style).toEqual([
      {borderRadius: 4, backgroundColor: COLORS.blackgrey},
      {width: 5, height: 5, backgroundColor: 'blue'}
    ]);
  });
});
