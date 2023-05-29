import { SQLiteDatabase } from 'react-native-sqlite-storage';

import ChannelList from '../../schema/ChannelListSchema';
import Migration from './migration.types';

const TABLE_NAME = ChannelList.getTableName();

class MigrationVersion1 implements Migration {
  async up(db: SQLiteDatabase): Promise<void> {
    const upQuery = `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
      id TEXT PRIMARY KEY NOT NULL,
      channel_picture TEXT,
      name TEXT,
      description TEXT,
      unread_count INTEGER NOT NULL DEFAULT 0,
      channel_type TEXT NOT NULL CHECK(channel_type IN ('PM', 'ANON_PM', 'GROUP', 'ANON_GROUP', 'TOPIC', 'POST_NOTIFICATION', 'ANON_POST_NOTIFICATION', 'FOLLOW')),
      last_updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      raw_json TEXT,
      created_at DATETIME NOT NULL)`;

    console.log(`===== MIGRATING: ${TABLE_NAME.toLocaleUpperCase()} TABLE =====`);
    await db.executeSql(upQuery);
    console.log(`===== DONE MIGRATING: ${TABLE_NAME.toLocaleUpperCase()}  TABLE =====`);
  }
  async down(db: SQLiteDatabase): Promise<void> {
    const downQuery = `DROP TABLE IF EXISTS ${TABLE_NAME}`;
    await db.executeSql(downQuery);
  }

}

export default new MigrationVersion1;
