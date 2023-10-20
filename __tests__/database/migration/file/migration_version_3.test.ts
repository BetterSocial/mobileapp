import {SQLiteDatabase} from 'react-native-sqlite-storage';

import MigrationVersion3 from '../../../../src/database/migration/file/migration_version_3';
import {mockDb} from '../../../../__utils__/mockedVariable/mockDb';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('TESTING Migration Version 3', () => {
  it('TEST migration up function', async () => {
    // Setup

    // Execution
    MigrationVersion3.up(mockDb);

    // Assertion
    expect(mockDb.executeSql).toHaveBeenCalledWith(
      `CREATE TABLE IF NOT EXISTS channel_list_members (
      id UUID PRIMARY KEY NOT NULL,
      channel_id TEXT NOT NULL,
      user_id UUID NOT NULL,
      is_moderator INTEGER NOT NULL DEFAULT 0,
      is_banned INTEGER NOT NULL DEFAULT 0,
      is_shadow_banned INTEGER NOT NULL DEFAULT 0,
      joined_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (channel_id) REFERENCES channel_lists (id)
    );`
    );
  });

  it('TEST migration down function', async () => {
    // Setup

    // Execution
    MigrationVersion3.down(mockDb);

    // Assertion
    expect(mockDb.executeSql).toHaveBeenCalledWith('DROP TABLE IF EXISTS channel_list_members');
  });
});
