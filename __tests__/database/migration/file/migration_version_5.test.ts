import {SQLiteDatabase} from 'react-native-sqlite-storage';

import MigrationVersion5 from '../../../../src/database/migration/file/migration_version_5';
import {mockDb} from '../../../../__utils__/mockedVariable/mockDb';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('TESTING Migration Version 5', () => {
  it('TEST migration up function', async () => {
    // Setup

    // Execution
    MigrationVersion5.up(mockDb);

    // Assertion
    expect(mockDb.executeSql).toHaveBeenCalledWith(
      `ALTER TABLE channel_lists
      ADD COLUMN expired_at DATETIME DEFAULT NULL;`
    );
  });

  it('TEST migration down function', async () => {
    // Setup

    // Execution
    MigrationVersion5.down(mockDb);

    // Assertion
    expect(mockDb.executeSql).toHaveBeenCalledWith(
      'ALTER TABLE channel_lists DROP COLUMN expired_at'
    );
  });
});
