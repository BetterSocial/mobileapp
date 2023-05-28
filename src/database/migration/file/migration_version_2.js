const TABLE_NAME = 'users';
const migration = {
  up: async (db) => {
    const upQuery = `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
      user_id UUID PRIMARY KEY NOT NULL DEFAULT (UUID()),
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
  },
  down: async (db) => {
    const downQuery = `DROP TABLE IF EXISTS ${TABLE_NAME}`;
    await db.executeSql(downQuery);
  }
};

export default migration;
