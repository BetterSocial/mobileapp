import {SQLiteDatabase} from 'react-native-sqlite-storage';

import Migration from './migration.types';

const TABLE_NAME = 'migration_versions';

class MigrationVersion0 implements Migration {
  up = async (db: SQLiteDatabase): Promise<void> => {
    const upQuery = `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      version INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`;

    console.log(`===== MIGRATING: ${TABLE_NAME.toLocaleUpperCase()} TABLE =====`);
    await db.executeSql(upQuery);
    console.log(`===== DONE MIGRATING: ${TABLE_NAME.toLocaleUpperCase()} TABLE =====`);
  };

  down = async (db: SQLiteDatabase): Promise<void> => {
    const downQuery = `DROP TABLE IF EXISTS ${TABLE_NAME}`;
    await db.executeSql(downQuery);
  };
}

export default new MigrationVersion0();
