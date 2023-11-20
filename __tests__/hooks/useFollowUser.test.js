// eslint-disable-next-line no-use-before-define
import React from 'react';
import {act, renderHook} from '@testing-library/react-hooks';
import {useIsFocused} from '@react-navigation/core';

import following from '../../src/context/actions/following';
import useFollowUser from '../../src/screens/ChannelListScreen/hooks/useFollowUser';
import useLocalDatabaseHook from '../../src/database/hooks/useLocalDatabaseHook';
import {Context} from '../../src/context';
import {getFollowing, setUnFollow} from '../../src/service/profile';

jest.mock('@react-navigation/core', () => ({
  useIsFocused: jest.fn()
}));

jest.mock('../../src/database/hooks/useLocalDatabaseHook', () => jest.fn());

jest.mock('../../src/context/actions/following', () => ({
  setFollowingUsers: jest.fn()
}));

jest.mock('../../src/service/profile', () => ({
  getFollowing: jest.fn(),
  setFollow: jest.fn(),
  setUnFollow: jest.fn()
}));

jest.mock('../../src/service/chat', () => ({
  sendSystemMessage: jest.fn()
}));

describe('useFollowUser', () => {
  const myProfile = {user_id: '123', username: 'testuser'};
  const followContext = {users: []};
  const followingDispatch = jest.fn();
  const profileContext = {myProfile};
  const contextValue = {
    following: [followContext, followingDispatch],
    profile: [profileContext]
  };
  const localDb = 'local-db';
  const refresh = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useIsFocused.mockReturnValue(true);
    useLocalDatabaseHook.mockReturnValue({localDb, refresh});
    getFollowing.mockResolvedValue({data: []});
  });

  it('should call getFollowing and setFollowingUsers on mount', async () => {
    useIsFocused.mockReturnValue(true);
    getFollowing.mockResolvedValue({data: []});

    renderHook(() => useFollowUser(), {
      wrapper: ({children}) => <Context.Provider value={contextValue}>{children}</Context.Provider>
    });

    expect(useIsFocused).toHaveBeenCalled();
    expect(getFollowing).toHaveBeenCalled();
  });

  it('should not call setFollowingUsers when not focused', async () => {
    useIsFocused.mockReturnValue(false);
    getFollowing.mockResolvedValue({data: []});

    renderHook(() => useFollowUser(), {
      wrapper: ({children}) => <Context.Provider value={contextValue}>{children}</Context.Provider>
    });

    expect(useIsFocused).toHaveBeenCalled();
    expect(following.setFollowingUsers).not.toHaveBeenCalled();
  });

  it('should call sendSystemMessage and setFollow when handleFollow is called', async () => {
    const channel = {id: '123', rawJson: {members: [{user_id: '456'}]}};
    useIsFocused.mockReturnValue(true);
    getFollowing.mockResolvedValue({data: []});

    const {result} = renderHook(() => useFollowUser(), {
      wrapper: ({children}) => <Context.Provider value={contextValue}>{children}</Context.Provider>
    });

    act(() => {
      result.current.handleFollow(channel);
    });

    expect(following.setFollowingUsers).toHaveBeenCalled();
  });

  it('should call setUnFollow when handleFollow is called and user is already following', async () => {
    const channel = {id: '123', rawJson: {members: [{user_id: '456'}]}};
    const data = {
      user_id_follower: myProfile.user_id,
      user_id_followed: '456',
      username_follower: myProfile.username,
      username_followed: 'testuser2',
      follow_source: 'chat'
    };
    followContext.users.push(data);
    useIsFocused.mockReturnValue(true);
    getFollowing.mockResolvedValue({data: []});

    following.setFollowingUsers = jest.fn();

    const {result} = renderHook(() => useFollowUser(), {
      wrapper: ({children}) => <Context.Provider value={contextValue}>{children}</Context.Provider>
    });

    await result.current.handleFollow(channel);

    expect(following.setFollowingUsers).toHaveBeenCalled();
    expect(setUnFollow).toHaveBeenCalled();
  });
});
