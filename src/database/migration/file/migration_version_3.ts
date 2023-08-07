import {SQLiteDatabase} from 'react-native-sqlite-storage';

import ChannelListMemberSchema from '../../schema/ChannelListMemberSchema';
import Migration from './migration.types';

class MigrationVersion3 implements Migration {
  up = async (db: SQLiteDatabase): Promise<void> => {
    const upQuery = `CREATE TABLE IF NOT EXISTS ${ChannelListMemberSchema.getTableName()} (
      id UUID PRIMARY KEY NOT NULL,
      channel_id TEXT NOT NULL,
      user_id UUID NOT NULL,
      is_moderator INTEGER NOT NULL DEFAULT 0,
      is_banned INTEGER NOT NULL DEFAULT 0,
      is_shadow_banned INTEGER NOT NULL DEFAULT 0,
      joined_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (channel_id) REFERENCES channel_lists (id)
    );`;

    console.log(
      `===== MIGRATING: ${ChannelListMemberSchema.getTableName().toLocaleUpperCase()} TABLE =====`
    );
    await db.executeSql(upQuery);
    console.log(
      `===== DONE MIGRATING: ${ChannelListMemberSchema.getTableName().toLocaleUpperCase()}  TABLE =====`
    );
  };

  down = async (db: SQLiteDatabase): Promise<void> => {
    console.log(
      `===== DOWNGRADING: ${ChannelListMemberSchema.getTableName().toLocaleUpperCase()} TABLE =====`
    );
    const downQuery = `DROP TABLE IF EXISTS ${ChannelListMemberSchema.getTableName()}`;
    await db.executeSql(downQuery);
    console.log(
      `===== DONE DOWNGRADING: ${ChannelListMemberSchema.getTableName().toLocaleUpperCase()}  TABLE =====`
    );
  };
}

export default new MigrationVersion3();
