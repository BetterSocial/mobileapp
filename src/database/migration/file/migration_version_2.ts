import {SQLiteDatabase} from 'react-native-sqlite-storage';

import Migration from './migration.types';
import UserSchema from '../../schema/UserSchema';

const TABLE_NAME = UserSchema.getTableName();

class MigrationVersion2 implements Migration {
  up = async (db: SQLiteDatabase): Promise<void> => {
    const upQuery = `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
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
    );`;

    console.log(`===== MIGRATING: ${TABLE_NAME.toLocaleUpperCase()} TABLE =====`);
    await db.executeSql(upQuery);
    console.log(`===== DONE MIGRATING: ${TABLE_NAME.toLocaleUpperCase()}  TABLE =====`);
  };

  down = async (db: SQLiteDatabase): Promise<void> => {
    console.log(`===== DOWNGRADING: ${TABLE_NAME.toLocaleUpperCase()}  TABLE =====`);
    const downQuery = `DROP TABLE IF EXISTS ${TABLE_NAME}`;
    await db.executeSql(downQuery);
    console.log(`===== DONE DOWNGRADING: ${TABLE_NAME.toLocaleUpperCase()}  TABLE =====`);
  };
}

export default new MigrationVersion2();
