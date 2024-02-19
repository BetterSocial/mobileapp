import {SQLiteDatabase} from 'react-native-sqlite-storage';

import ChannelList from '../../schema/ChannelListSchema';
import Migration from './migration.types';

const TABLE_NAME = ChannelList.getTableName();
const COLUMN_NAME_ADDED = 'anon_user_info_color_name';

class MigrationVersion10 implements Migration {
  up = async (db: SQLiteDatabase): Promise<void> => {
    const upQuery = `ALTER TABLE ${TABLE_NAME} ADD COLUMN ${COLUMN_NAME_ADDED} TEXT;`;

    console.log(`====== MIGRATING: ${TABLE_NAME.toLocaleUpperCase()} TABLE ======`);

    await db.executeSql(upQuery);
    console.log(`====== DONE MIGRATING: ${TABLE_NAME.toLocaleUpperCase()}  TABLE =====`);
  };

  down = async (db: SQLiteDatabase): Promise<void> => {
    console.log(`====== DOWNGRADING: ${TABLE_NAME.toLocaleUpperCase()} TABLE ======`);
    const downQuery = `ALTER TABLE ${TABLE_NAME} DROP COLUMN ${COLUMN_NAME_ADDED};`;
    await db.executeSql(downQuery);
    console.log(`====== DONE DOWNGRADING: ${TABLE_NAME.toLocaleUpperCase()}  TABLE ======`);
  };
}

export default new MigrationVersion10();
