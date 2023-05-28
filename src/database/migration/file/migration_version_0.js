const migration = {
  up: async (db) => {
    const upQuery = `CREATE TABLE IF NOT EXISTS migration_versions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        version INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`;

    console.log('===== MIGRATING: MIGRATION VERSIONS TABLE =====');
    await db.executeSql(upQuery);
    console.log('===== DONE MIGRATING: MIGRATION VERSIONS TABLE =====');
  },
  down: async (db) => {
    const downQuery = 'DROP TABLE IF EXISTS migration_versions';
    await db.executeSql(downQuery);
  }
};

export default migration;
