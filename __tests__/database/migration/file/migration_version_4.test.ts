import MigrationVersion4 from '../../../../src/database/migration/file/migration_version_4';
import {mockDb} from '../../../../__utils__/mockedVariable/mockDb';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('TESTING Migration Version 4', () => {
  it('TEST migration up function', async () => {
    // Setup

    // Execution
    MigrationVersion4.up(mockDb);

    // Assertion
    expect(mockDb.executeSql).toHaveBeenCalledWith(
      `CREATE TABLE IF NOT EXISTS chats (
        id UUID PRIMARY KEY NOT NULL,
        channel_id TEXT NOT NULL,
        user_id UUID NOT NULL,
        message TEXT NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('regular')),
        status TEXT NOT NULL CHECK(status IN ('pending', 'sent', 'delivered', 'read')),
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        raw_json TEXT,
        FOREIGN KEY (channel_id) REFERENCES channel_lists (id),
        FOREIGN KEY (user_id) REFERENCES users (id)
      );`
    );
  });

  it('TEST migration down function', async () => {
    // Setup

    // Execution
    MigrationVersion4.down(mockDb);

    // Assertion
    expect(mockDb.executeSql).toHaveBeenCalledWith('DROP TABLE IF EXISTS chats');
  });
});
