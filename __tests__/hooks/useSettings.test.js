import Toast from 'react-native-simple-toast';
import {Alert} from 'react-native';
import {act, renderHook} from '@testing-library/react-hooks';
import {mockMMKVClearAll, mockMMKVGetString, mockMMKVSet} from 'react-native-mmkv';

import * as cacheUtils from '../../src/utils/cache';
import * as mainFeed from '../../src/context/actions/feeds';
import * as resetProfileAction from '../../src/context/actions/myProfileFeed';
import Store from '../../src/context/Store';
import useSettings from '../../src/screens/Settings/hooks/useSettings';

jest.mock('react-native-simple-toast');

jest.mock('recoil', () => ({
  useRecoilValue: jest.fn(() => 0),
  atom: jest.fn(() => 0),
  useSetRecoilState: jest.fn(() => 0),
  useRecoilState: jest.fn(() => [0, jest.fn()])
}));

describe('useSetting should run correctly', () => {
  it('logout should run correctly', async () => {
    const {result} = renderHook(useSettings, {wrapper: Store});
    const spyCacheUtils = jest.spyOn(cacheUtils, 'removeAllCache');
    const spyResetProfile = jest.spyOn(resetProfileAction, 'resetProfileFeed');
    const spyFeed = jest.spyOn(mainFeed, 'setMainFeeds');

    mockMMKVGetString.mockReturnValueOnce('password');

    await result.current.logout();
    expect(spyCacheUtils).toHaveBeenCalled();
    expect(spyResetProfile).toHaveBeenCalled();
    expect(spyFeed).toHaveBeenCalled();

    expect(mockMMKVGetString).toHaveBeenCalledWith('onboardingPassword');
    expect(mockMMKVClearAll).toHaveBeenCalled();
    expect(mockMMKVSet).toHaveBeenCalledWith('onboardingPassword', 'password');
  });

  it('doDelete accounst should run correctly', async () => {
    const {result} = renderHook(useSettings, {wrapper: Store});
    act(() => {
      result.current.doDeleteAccount();
    });
    expect(result.current.isLoadingDeletingAccount).toBeTruthy();
  });

  it('showDeleteAccountAlert should show popup alert', () => {
    const {result} = renderHook(useSettings, {wrapper: Store});
    const spyAlert = jest.spyOn(Alert, 'alert');
    act(() => {
      result.current.showDeleteAccountAlert();
    });
    expect(spyAlert).toHaveBeenCalled();
  });

  it('handleResponseDelete should run correctly', () => {
    const {result} = renderHook(useSettings, {wrapper: Store});
    Toast.show = jest.fn();
    act(() => {
      result.current.handleResponseDelete({status: 'success'});
    });
    expect(Toast.show).toHaveBeenCalled();
    act(() => {
      result.current.handleResponseDelete({status: 'failed'});
    });
    expect(result.current.isLoadingDeletingAccount).toBeFalsy();
  });
});
