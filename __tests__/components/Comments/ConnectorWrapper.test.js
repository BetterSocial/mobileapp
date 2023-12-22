import * as React from 'react';
import {cleanup, render} from '@testing-library/react-native';

import ConnectorWrapper, {styles} from '../../../src/components/Comments/ConnectorWrapper';
import {COLORS} from '../../../src/utils/theme';

jest.useFakeTimers();

describe('Connector Wrapper should run correctly', () => {
  it('should match snapshot', () => {
    afterEach(cleanup);
    const {toJSON} = render(<ConnectorWrapper index={0} />);
    expect(toJSON).toMatchSnapshot();
  });

  it('connect styles should correct', () => {
    expect(styles.connector(0)).toEqual({
      marginLeft: -1,
      width: 24,
      height: 14,
      borderLeftWidth: 1,
      borderBottomWidth: 2,
      borderBottomLeftRadius: 21,
      borderLeftColor: COLORS.gray1,
      borderBottomColor: COLORS.gray1
    });

    expect(styles.connector(1)).toEqual({
      marginLeft: -1,
      width: 24,
      height: 14,
      borderLeftWidth: 1,
      borderBottomWidth: 2,
      borderBottomLeftRadius: 21,
      borderLeftColor: 'transparent',
      borderBottomColor: 'transparent'
    });
  });
});
