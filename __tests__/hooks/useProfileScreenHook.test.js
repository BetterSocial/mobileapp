import React from 'react';
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {renderHook} from '@testing-library/react-hooks';

import ProfileRepo from '../../src/service/repo/profileRepo';
import StorageUtils from '../../src/utils/storage';
import useProfileScreenHook from '../../src/hooks/screen/useProfileScreenHook';
import {Context} from '../../src/context';
import {myProfileMock} from '../../__mocks__/mockMyProfile';

jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);
describe('useProfileScreenHook should run correctly', () => {
  const dispatch = jest.fn();
  const wrapper = ({children}) => (
    <Context.Provider
      value={{
        myProfileFeed: [{feeds: [], anonymousFeeds: []}, dispatch],
        feeds: [{feeds: []}, dispatch],
        profile: [{myProfile: myProfileMock}, dispatch]
      }}>
      <SafeAreaProvider>{children}</SafeAreaProvider>
    </Context.Provider>
  );

  it('setTabIndexToSigned should run correctly', async () => {
    const {result} = renderHook(useProfileScreenHook, {wrapper});
    await result.current.setTabIndexToSigned();
    expect(result.current.profileTabIndex).toEqual(0);
    await result.current.setTabIndexToAnonymous();
    expect(result.current.profileTabIndex).toEqual(1);
  });

  it('fetchAnonymousPost should run correctly', async () => {
    const {result} = renderHook(useProfileScreenHook, {wrapper});
    const spyApiGet = jest
      .spyOn(ProfileRepo, 'getSelfAnonymousFeed')
      .mockResolvedValue({isSuccess: true, data: []});
    await result.current.fetchAnonymousPost(0, 10);
    expect(result.current.isLoadingFetchingAnonymousPosts).toBeFalsy();
  });
});
