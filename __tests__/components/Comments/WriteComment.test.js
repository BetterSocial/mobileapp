import * as React from 'react';
import {render, cleanup, fireEvent} from '@testing-library/react-native';
import WriteComment, {styles} from '../../../src/components/Comments/WriteComment';
import Store from '../../../src/context/Store';
import {fonts} from '../../../src/utils/fonts';
import {COLORS} from '../../../src/utils/theme';
import dimen from '../../../src/utils/dimen';

describe('WriteComment should run correctly', () => {
  afterEach(cleanup);
  it('should match snapshot', () => {
    const onPress = jest.fn();
    const onChangeText = jest.fn();
    const username = 'agita';
    const {toJSON, getAllByText, getByTestId} = render(
      <WriteComment
        onPress={onPress}
        onChangeText={onChangeText}
        value="test comment"
        username={username}
        showProfileConnector={true}
      />,
      {wrapper: Store}
    );
    expect(toJSON).toMatchSnapshot();
    expect(getAllByText(username)).toHaveLength(1);
    fireEvent.changeText(getByTestId('changeinput'));
    expect(onChangeText).toHaveBeenCalled();
    expect(getByTestId('iscommentenable').props.disabled).toBeFalsy();
    fireEvent.press(getByTestId('iscommentenable'));
    expect(onPress).toHaveBeenCalled();
  });

  it('styles should run correctly', () => {
    expect(styles.replyToContainer).toEqual({
      marginLeft: 60,
      alignItems: 'center',
      flexDirection: 'row'
    });
    expect(styles.container).toEqual({
      flex: 1,
      backgroundColor: COLORS.almostBlack,
      width: '100%',
      paddingRight: dimen.normalizeDimen(16),
      paddingLeft: dimen.normalizeDimen(16),
      flexDirection: 'row',
      zIndex: 100
    });
    expect(styles.btn(true)).toEqual({
      backgroundColor: COLORS.gray100,
      borderRadius: 18,
      width: 35,
      height: 35,
      display: 'flex',
      justifyContent: 'center',
      marginBottom: 1.5,
      alignSelf: 'flex-end'
    });
    expect(styles.btn(false)).toEqual({
      backgroundColor: COLORS.bondi_blue,
      borderRadius: 18,
      width: 35,
      height: 35,
      display: 'flex',
      justifyContent: 'center',
      marginBottom: 1.5,
      alignSelf: 'flex-end'
    });

    expect(styles.connectorTop(true, true)).toEqual({
      height: 36,
      width: 1,
      backgroundColor: COLORS.balance_gray,
      position: 'absolute',
      top: 0,
      left: 60,
      zIndex: -100
    });

    expect(styles.connectorTop(false, false)).toEqual({
      height: 0,
      width: 1,
      backgroundColor: COLORS.balance_gray,
      position: 'absolute',
      top: 0,
      left: 37,
      zIndex: -100
    });

    expect(styles.connectorBottom(true, true)).toEqual({
      height: 20,
      width: 1,
      backgroundColor: COLORS.balance_gray,
      position: 'absolute',
      top: 0,
      left: 60,
      zIndex: -100
    });

    expect(styles.connectorBottom(false, false)).toEqual({
      height: 0,
      width: 1,
      backgroundColor: COLORS.balance_gray,
      position: 'absolute',
      top: 0,
      left: 37,
      zIndex: -100
    });
  });
});
