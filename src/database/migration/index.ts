/* eslint-disable no-await-in-loop */
import LocalDatabase from '..';
import allMigrationsFile from './file/index';

export const TARGET_MIGRATION_VERSION = 7;

/**
 * PROCEED WITH CAUTION
 * Set to true if you want to drop all tables and recreate them
 */
export const DROP_ALL_DB = false;

const getCurrentMigrationVersion = async () => {
  const db = await LocalDatabase.getDBConnection();

  try {
    const [currentMigrationVersionResult] = await db.executeSql(
      'SELECT version FROM migration_versions ORDER BY version DESC LIMIT 1'
    );

    if (currentMigrationVersionResult?.rows?.length > 0) {
      return currentMigrationVersionResult?.rows?.raw()?.[0]?.version;
    }

    return -1;
  } catch (e) {
    console.log(e);
    return -1;
  }
};

const incrementMigrationVersion = async (nextVersion) => {
  const db = await LocalDatabase.getDBConnection();

  try {
    const currentMigrationVersion = await getCurrentMigrationVersion();
    if (currentMigrationVersion === 0 && nextVersion === 0) return;
    if (currentMigrationVersion >= TARGET_MIGRATION_VERSION) return;

    console.log(
      `===== INCREMENTING VERSION: VERSION ${currentMigrationVersion} => VERSION ${nextVersion} =====`
    );
    await db.executeSql(`INSERT INTO migration_versions (version) VALUES (${nextVersion})`);
    console.log(`===== DONE INCREMENTING VERSION: CURRENT VERSION ${nextVersion} =====`);
  } catch (e) {
    console.log(e);
  }
};

const rollbackAllMigrations = async () => {
  if (!__DEV__) return;

  const db = await LocalDatabase.getDBConnection();
  const currentMigrationVersion = await getCurrentMigrationVersion();

  if (currentMigrationVersion === -1) return;

  console.log('===== ROLLBACKING DB =====');

  for (let version = currentMigrationVersion; version >= 0; version -= 1) {
    try {
      const migration = allMigrationsFile[version];
      await migration.down(db);
      if (version === 0) break;
      await db.executeSql(`DELETE FROM migration_versions WHERE version = ${version}`);
    } catch (e) {
      console.log('error rollbacking db');
      console.log(e);
    }
  }

  console.log('===== DONE ROLLBACKING DB =====');
};

const migrateDb = async () => {
  const db = await LocalDatabase.getDBConnection();
  if (DROP_ALL_DB) {
    await rollbackAllMigrations();
  }

  const currentMigrationVersion = await getCurrentMigrationVersion();
  if (currentMigrationVersion >= TARGET_MIGRATION_VERSION) return;

  console.log('===== MIGRATING DB =====');

  for (let version = currentMigrationVersion; version <= TARGET_MIGRATION_VERSION; version += 1) {
    try {
      const migration = allMigrationsFile[version];
      await migration?.up(db);
      await incrementMigrationVersion(version);
    } catch (e) {
      console.log('error migrating db');
      console.log(e);
    }
  }

  console.log('===== DONE MIGRATING DB =====');
};

const LocalDatabaseMigration = {
  migrateDb
};

export default LocalDatabaseMigration;
