import React from 'react';
import {renderHook} from '@testing-library/react-hooks';
import useWriteComment from '../../src/components/Comments/hooks/useWriteComment';
import {Context} from '../../src/context/Store';

describe('useWriteComment should run correctly', () => {
  const dispatchComment = jest.fn();
  const wrapper = ({children}) => (
    <Context.Provider
      value={{
        comments: [{}, dispatchComment]
      }}>
      {children}
    </Context.Provider>
  );

  it('useWriteComment updateComment handleUserName should run correctly', async () => {
    const {result} = renderHook(useWriteComment, {wrapper});
    expect(result.current.handleUserName({anon_user_info_emoji_name: 'bear'})).toEqual(
      'Anonymous bear'
    );
    expect(result.current.handleUserName({actor: {data: {username: 'Agita'}}})).toEqual('Agita');
  });
  it('useWriteComment updateComment handleUserNameReplyComment should run correctly', async () => {
    const {result} = renderHook(useWriteComment, {wrapper});
    expect(
      result.current.handleUsernameReplyComment({data: {anon_user_info_emoji_name: 'bear'}})
    ).toEqual('Anonymous bear');
    expect(result.current.handleUsernameReplyComment({user: {data: {username: 'Agita'}}})).toEqual(
      'Agita'
    );
  });
});
