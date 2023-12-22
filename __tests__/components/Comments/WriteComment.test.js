import * as React from 'react';
import {render, cleanup, fireEvent} from '@testing-library/react-native';
import WriteComment, {styles} from '../../../src/components/Comments/WriteComment';
import Store from '../../../src/context/Store';
import {fonts} from '../../../src/utils/fonts';
import {COLORS} from '../../../src/utils/theme';

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
    expect(styles.replyToContainer(true)).toEqual({
      marginLeft: 90,
      fontFamily: fonts.inter[600],
      marginBottom: 11,
      marginTop: 7,
      lineHeight: 15,
      fontSize: 12,
      color: COLORS.gray
    });
    expect(styles.replyToContainer(false)).toEqual({
      marginLeft: 60,
      fontFamily: fonts.inter[600],
      marginBottom: 11,
      marginTop: 7,
      lineHeight: 15,
      fontSize: 12,
      color: COLORS.gray
    });
    expect(styles.container(true)).toEqual({
      flex: 1,
      backgroundColor: COLORS.white,
      width: '100%',
      paddingRight: 10,
      paddingLeft: 50,
      flexDirection: 'row',
      zIndex: 100
    });
    expect(styles.container(false)).toEqual({
      flex: 1,
      backgroundColor: COLORS.white,
      width: '100%',
      paddingRight: 10,
      paddingLeft: 20,
      flexDirection: 'row',
      zIndex: 100
    });
    expect(styles.btn(true)).toEqual({
      backgroundColor: COLORS.concrete,
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
      backgroundColor: COLORS.gray1,
      position: 'absolute',
      top: 0,
      left: 60,
      zIndex: -100
    });

    expect(styles.connectorTop(false, false)).toEqual({
      height: 0,
      width: 1,
      backgroundColor: COLORS.gray1,
      position: 'absolute',
      top: 0,
      left: 30,
      zIndex: -100
    });

    expect(styles.connectorBottom(true, true)).toEqual({
      height: 20,
      width: 1,
      backgroundColor: COLORS.gray1,
      position: 'absolute',
      top: 0,
      left: 60,
      zIndex: -100
    });

    expect(styles.connectorBottom(false, false)).toEqual({
      height: 0,
      width: 1,
      backgroundColor: COLORS.gray1,
      position: 'absolute',
      top: 0,
      left: 30,
      zIndex: -100
    });
  });
});
