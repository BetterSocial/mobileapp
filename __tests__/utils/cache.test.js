import {act} from 'react-test-renderer';
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

import {getSpecificCache, removeAllCache, saveToCache} from '../../src/utils/cache';

describe('utils cache should run correctly', () => {
  it('remove all cache shoule run correctly', () => {
    const mockRemoveCache = jest.spyOn(mockAsyncStorage, 'clear');
    act(() => {
      removeAllCache();
    });
    expect(mockRemoveCache).toHaveBeenCalled();
  });
  it('saveToCache should run correctly', () => {
    const callback = jest.fn().mockImplementation(() => undefined, 'cool');

    const mockgetItem = jest
      .spyOn(mockAsyncStorage, 'getItem')
      .mockImplementation(('cache', callback));
    act(() => {
      saveToCache('cache', {name: 'agita'});
    });
    expect(mockgetItem).toHaveBeenCalled();
  });
  it('saveToCache should return json vale', async () => {
    await saveToCache('data', {name: 'agita'});
    await getSpecificCache('data', (data) => {
      expect(data).toEqual({name: 'agita'});
    });
  });
});
