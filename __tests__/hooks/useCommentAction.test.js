import React from 'react';
import {renderHook} from '@testing-library/react-hooks';
import {Alert} from 'react-native';
import useCommentAction from '../../src/components/Comments/hooks/useCommentAction';
import {Context} from '../../src/context/Store';
import {myProfileMock} from '../../__mocks__/mockMyProfile';
import * as servicComment from '../../src/service/comment';

const mockGoBack = jest.fn();
const mockGetComment = jest.fn();

jest.mock('@react-navigation/core', () => ({
  useRoute: jest.fn().mockImplementation(() => ({params: {getComment: mockGetComment}})),
  useNavigation: jest.fn().mockImplementation(() => ({
    goBack: mockGoBack
  }))
}));

describe('useCommentAction should run correctly', () => {
  const mockProfile = myProfileMock;
  const wrapper = ({children}) => (
    <Context.Provider
      value={{
        profile: [{isShowHeader: true, myProfile: mockProfile, navbarTitle: "Who you're following"}]
      }}>
      {children}
    </Context.Provider>
  );

  it('useCommentAction showAlert should run correctly', async () => {
    const {result} = renderHook(useCommentAction, {wrapper});
    const spy = jest.spyOn(Alert, 'alert');
    const mockCallback = jest.fn();
    await result.current.showAlertDelete({user: {id: mockProfile.user_id}}, true, mockCallback);
    expect(spy).toHaveBeenCalled();
  });

  it('useCommentAction onDeleteCommentClicked should run correctly', async () => {
    const {result} = renderHook(useCommentAction, {wrapper});
    const mockCallback = jest.fn();
    const spy = jest.spyOn(servicComment, 'deleteComment').mockResolvedValue({success: true});
    await result.current.onDeleteCommentClicked({id: '123'}, true, mockCallback);
    expect(spy).toHaveBeenCalled();
    expect(mockGetComment).toHaveBeenCalled();
  });

  it('useCommentAction onDeleteCommentClicked FAIL should run correctly', async () => {
    const {result} = renderHook(useCommentAction, {wrapper});
    const mockCallback = jest.fn();
    const spyConsole = jest.spyOn(console, 'log');
    jest.spyOn(servicComment, 'deleteComment').mockRejectedValue({success: false});
    await result.current.onDeleteCommentClicked({id: '123'}, true, mockCallback);
    expect(spyConsole).toHaveBeenCalled();
  });
});
