import React from 'react';
import {renderHook} from '@testing-library/react-hooks';
import useUpdateComment from '../../src/components/Comments/hooks/useUpdateComment';
import {Context} from '../../src/context/Store';
import * as servicComment from '../../src/service/comment';

describe('useUpdateComment should run correctly', () => {
  const dispatchComment = jest.fn();
  const wrapper = ({children}) => (
    <Context.Provider
      value={{
        comments: [{}, dispatchComment]
      }}>
      {children}
    </Context.Provider>
  );

  it('useUpdateComment updateComment should run correctly', async () => {
    const {result} = renderHook(useUpdateComment, {wrapper});
    const spyGetComment = jest
      .spyOn(servicComment, 'getCommentList')
      .mockResolvedValue({data: {data: {id: '123'}}});
    await result.current.updateComment('123');
    expect(spyGetComment).toHaveBeenCalled();
  });
  it('useUpdateComment error updateComment should run correctly', async () => {
    const {result} = renderHook(useUpdateComment, {wrapper});
    const spyConsole = jest.spyOn(console, 'log');
    jest.spyOn(servicComment, 'getCommentList').mockRejectedValue({success: false});
    await result.current.updateComment('123');
    expect(spyConsole).toHaveBeenCalled();
  });
});
