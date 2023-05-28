import ChannelList from '../../schema/ChannelListSchema';

const TABLE_NAME = ChannelList.getTableName();
const migration = {
  up: async (db) => {
    const upQuery = `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
      id TEXT PRIMARY KEY NOT NULL,
      channel_picture TEXT,
      name TEXT,
      description TEXT,
      unread_count INTEGER NOT NULL DEFAULT 0,
      channel_type TEXT NOT NULL CHECK(channel_type IN ('PM', 'ANON_PM', 'GROUP', 'ANON_GROUP', 'TOPIC', 'POST_NOTIFICATION', 'FOLLOW')),
      last_updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME NOT NULL)`;

    console.log(`===== MIGRATING: ${TABLE_NAME.toLocaleUpperCase()} TABLE =====`);
    await db.executeSql(upQuery);
    console.log(`===== DONE MIGRATING: ${TABLE_NAME.toLocaleUpperCase()}  TABLE =====`);
  },
  down: async (db) => {
    const downQuery = `DROP TABLE IF EXISTS ${TABLE_NAME}`;
    await db.executeSql(downQuery);
  }
};

export default migration;
