import {SQLiteDatabase, Transaction} from 'react-native-sqlite-storage';

export const mockDbExecuteSql = jest.fn();
export const mockTransactionExecuteSql = jest.fn();

export const mockDb: SQLiteDatabase = {
  executeSql: mockDbExecuteSql,
  dbName: '',
  transaction: (resolver) => {
    return resolver(mockTransaction);
  },
  attach: jest.fn(),
  close: jest.fn(),
  detach: jest.fn(),
  readTransaction: jest.fn()
};

export const mockTransaction: Transaction = {
  executeSql: mockTransactionExecuteSql
};
