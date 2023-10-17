import {SQLiteDatabase} from 'react-native-sqlite-storage';

import MigrationVersion0 from '../../../../src/database/migration/file/migration_version_0';

const mockDb: SQLiteDatabase = {
  executeSql: jest.fn(),
  dbName: '',
  transaction: jest.fn(),
  attach: jest.fn(),
  close: jest.fn(),
  detach: jest.fn(),
  readTransaction: jest.fn()
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('TESTING Migration Version 0', () => {
  it('TEST migration up function', async () => {
    // Setup

    // Execution
    MigrationVersion0.up(mockDb);

    // Assertion
    expect(mockDb.executeSql).toHaveBeenCalledWith(
      `CREATE TABLE IF NOT EXISTS migration_versions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      version INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`
    );
  });

  it('TEST migration down function', async () => {
    // Setup

    // Execution
    MigrationVersion0.down(mockDb);

    // Assertion
    expect(mockDb.executeSql).toHaveBeenCalledWith('DROP TABLE IF EXISTS migration_versions');
  });
});
