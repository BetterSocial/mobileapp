import {SQLiteDatabase} from 'react-native-sqlite-storage';

import MigrationVersion2 from '../../../../src/database/migration/file/migration_version_2';
import {mockDb} from '../../../../__utils__/mockedVariable/mockDb';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('TESTING Migration Version 2', () => {
  it('TEST migration up function', async () => {
    // Setup

    // Execution
    MigrationVersion2.up(mockDb);

    // Assertion
    expect(mockDb.executeSql).toHaveBeenCalledWith(
      `CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY NOT NULL,
      channel_id UUID NOT NULL,
      user_id UUID NOT NULL,
      username TEXT NOT NULL,
      country_code TEXT,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME,
      last_active_at DATETIME,
      profile_picture TEXT,
      bio TEXT,
      is_banned INTEGER NOT NULL DEFAULT 0
    );`
    );
  });

  it('TEST migration down function', async () => {
    // Setup

    // Execution
    MigrationVersion2.down(mockDb);

    // Assertion
    expect(mockDb.executeSql).toHaveBeenCalledWith('DROP TABLE IF EXISTS users');
  });
});
