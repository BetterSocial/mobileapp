import MigrationVersion1 from '../../../../src/database/migration/file/migration_version_1';
import {mockDb} from '../../../../__utils__/mockedVariable/mockDb';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('TESTING Migration Version 1', () => {
  it('TEST migration up function', async () => {
    // Setup

    // Execution
    MigrationVersion1.up(mockDb);

    // Assertion
    expect(mockDb.executeSql).toHaveBeenCalledWith(
      `CREATE TABLE IF NOT EXISTS channel_lists (
      id TEXT PRIMARY KEY NOT NULL,
      channel_picture TEXT,
      name TEXT,
      description TEXT,
      unread_count INTEGER NOT NULL DEFAULT 0,
      channel_type TEXT NOT NULL CHECK(channel_type IN ('PM', 'ANON_PM', 'GROUP', 'ANON_GROUP', 'TOPIC', 'POST_NOTIFICATION', 'ANON_POST_NOTIFICATION', 'FOLLOW')),
      last_updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      last_updated_by TEXT,
      raw_json TEXT,
      created_at DATETIME NOT NULL)`
    );
  });

  it('TEST migration down function', async () => {
    // Setup

    // Execution
    MigrationVersion1.down(mockDb);

    // Assertion
    expect(mockDb.executeSql).toHaveBeenCalledWith('DROP TABLE IF EXISTS channel_lists');
  });
});
