import AsyncStorage from '@react-native-async-storage/async-storage';
import {FEEDS_CACHE, TOPIC_LIST} from './constant';
import {
  callbackSaveToCache,
  saveToCache,
  callbackGetSpecificCache,
  getSpecificCache
} from './index';

describe('cache test utils should run correctly', () => {
  const data = {
    [FEEDS_CACHE]: [
      {name: 'agita', id: '1'},
      {name: 'jaka', id: '2'}
    ]
  };

  it('saveToCache should run correctly', async () => {
    const spyStorage = jest.spyOn(AsyncStorage, 'getItem');
    await saveToCache(FEEDS_CACHE, [
      {name: 'agita', id: '1'},
      {name: 'jaka', id: '2'}
    ]);
    expect(spyStorage).toHaveBeenCalled();
  });

  it('callbackSaveToCache should run correctly', async () => {
    const spyStorage = jest.spyOn(AsyncStorage, 'setItem');

    await callbackSaveToCache(
      TOPIC_LIST,
      [{name: '#apple'}, {name: 'microsoft'}],
      JSON.stringify(data)
    );
    expect(spyStorage).toHaveBeenCalled();
  });

  it('callbackGetSpecificCache should run correctly', async () => {
    const mockCallback = jest.fn();
    await callbackGetSpecificCache(TOPIC_LIST, mockCallback, JSON.stringify(data));
    expect(mockCallback).toHaveBeenCalled();
    await callbackGetSpecificCache(FEEDS_CACHE, mockCallback);
    expect(mockCallback).toHaveBeenCalled();
  });

  it('getSpecificCache should run correctly', async () => {
    const spyStorage = jest.spyOn(AsyncStorage, 'getItem');

    const mockCallback = jest.fn();
    await getSpecificCache(TOPIC_LIST, mockCallback);
    expect(spyStorage).toHaveBeenCalled();
  });
});
