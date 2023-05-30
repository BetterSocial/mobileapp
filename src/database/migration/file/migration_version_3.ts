import {SQLiteDatabase} from 'react-native-sqlite-storage';

import Migration from './migration.types';

const TABLE_NAME = 'channel_list_members';

class MigrationVersion3 implements Migration {
  up = async (db: SQLiteDatabase): Promise<void> => {
    const upQuery = `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
      id UUID PRIMARY KEY NOT NULL DEFAULT (UUID()),
      channel_id TEXT NOT NULL,
      user_id UUID NOT NULL,
      is_moderator INTEGER NOT NULL DEFAULT 0,
      is_banned INTEGER NOT NULL DEFAULT 0,
      is_shadow_banned INTEGER NOT NULL DEFAULT 0,
      joined_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (channel_id) REFERENCES channel_lists (id)
    );`;

    console.log(`===== MIGRATING: ${TABLE_NAME.toLocaleUpperCase()} TABLE =====`);
    await db.executeSql(upQuery);
    console.log(`===== DONE MIGRATING: ${TABLE_NAME.toLocaleUpperCase()}  TABLE =====`);
  };

  down = async (db: SQLiteDatabase): Promise<void> => {
    console.log(`===== DOWNGRADING: ${TABLE_NAME.toLocaleUpperCase()} TABLE =====`);
    const downQuery = `DROP TABLE IF EXISTS ${TABLE_NAME}`;
    await db.executeSql(downQuery);
    console.log(`===== DONE DOWNGRADING: ${TABLE_NAME.toLocaleUpperCase()}  TABLE =====`);
  };
}

export default new MigrationVersion3();
