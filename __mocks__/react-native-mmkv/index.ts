// mock react-native-mmkv

export const mockMMKVSet = jest.fn();
export const mockMMKVDelete = jest.fn();
export const mockMMKVGetString = jest.fn();
export const mockMMKVClearAll = jest.fn();

export const MMKV = jest.fn().mockImplementation(() => {
  return {
    set: mockMMKVSet,
    delete: mockMMKVDelete,
    getString: mockMMKVGetString,
    clearAll: mockMMKVClearAll
  };
});
