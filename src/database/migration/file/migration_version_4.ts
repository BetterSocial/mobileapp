import {SQLiteDatabase} from 'react-native-sqlite-storage';

import ChannelList from '../../schema/ChannelListSchema';
import ChatSchema from '../../schema/ChatSchema';
import Migration from './migration.types';

const TABLE_NAME = ChatSchema.getTableName();

class MigrationVersion4 implements Migration {
  up = async (db: SQLiteDatabase): Promise<void> => {
    const upQuery = `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
        id UUID PRIMARY KEY NOT NULL,
        channel_id TEXT NOT NULL,
        user_id UUID NOT NULL,
        message TEXT NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('regular')),
        status TEXT NOT NULL CHECK(status IN ('pending', 'sent', 'delivered', 'read')),
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        raw_json TEXT,
        FOREIGN KEY (channel_id) REFERENCES ${ChannelList.getTableName()} (id),
        FOREIGN KEY (user_id) REFERENCES users (id)
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

export default new MigrationVersion4();
