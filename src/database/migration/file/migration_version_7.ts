import {SQLiteDatabase} from 'react-native-sqlite-storage';

import ChannelList from '../../schema/ChannelListSchema';
import ChatSchema from '../../schema/ChatSchema';
import Migration from './migration.types';

const TABLE_NAME = ChatSchema.getTableName();

class MigrationVersion7 implements Migration {
  up = async (db: SQLiteDatabase): Promise<void> => {
    const upQueryStep1 = `CREATE TABLE IF NOT EXISTS ${TABLE_NAME}_temp (
        id UUID PRIMARY KEY NOT NULL,
        channel_id TEXT NOT NULL,
        user_id UUID NOT NULL,
        message TEXT NOT NULL,
        type TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        raw_json TEXT,
        FOREIGN KEY (channel_id) REFERENCES ${ChannelList.getTableName()} (id),
        FOREIGN KEY (user_id) REFERENCES users (id)
      );`;

    const upQueryStep2 = `INSERT INTO ${TABLE_NAME}_temp SELECT * FROM ${TABLE_NAME};`;
    const upQueryStep3 = `DROP TABLE ${TABLE_NAME};`;
    const upQueryStep4 = `ALTER TABLE ${TABLE_NAME}_temp RENAME TO ${TABLE_NAME};`;

    console.log(`===== MIGRATING: ${TABLE_NAME.toLocaleUpperCase()} TABLE =====`);
    await db.executeSql(upQueryStep1);
    await db.executeSql(upQueryStep2);
    await db.executeSql(upQueryStep3);
    await db.executeSql(upQueryStep4);
    console.log(`===== DONE MIGRATING: ${TABLE_NAME.toLocaleUpperCase()}  TABLE =====`);
  };

  down = async (db: SQLiteDatabase): Promise<void> => {
    console.log(`===== DOWNGRADING: ${TABLE_NAME.toLocaleUpperCase()} TABLE =====`);
    const downQuery = `DROP TABLE IF EXISTS ${TABLE_NAME}`;
    await db.executeSql(downQuery);
    console.log(`===== DONE DOWNGRADING: ${TABLE_NAME.toLocaleUpperCase()}  TABLE =====`);
  };
}

export default new MigrationVersion7();
