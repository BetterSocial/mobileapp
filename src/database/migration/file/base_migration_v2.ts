import {SQLiteDatabase} from 'react-native-sqlite-storage';

abstract class BaseMigrationV2 {
  abstract _migrationVersion: number;

  abstract _tableName: string;

  abstract upQuery(): string;

  abstract downQuery(): string | null;

  async up(db: SQLiteDatabase): Promise<void> {
    console.log(
      `====== MIGRATING VERSION ${
        this._migrationVersion
      }: ${this._tableName.toLocaleUpperCase()} TABLE ======`
    );

    await db.executeSql(this.upQuery());

    console.log(
      `====== DONE MIGRATING VERSION ${
        this._migrationVersion
      }: ${this._tableName.toLocaleUpperCase()}  TABLE =====`
    );
  }

  async down(db: SQLiteDatabase): Promise<void> {
    console.log(
      `====== DOWNGRADING VERSION ${
        this._migrationVersion
      }: ${this._tableName.toLocaleUpperCase()} TABLE ======`
    );
    const query = this.downQuery();
    if (query) await db.executeSql(query);

    console.log(
      `====== DONE DOWNGRADING VERSION ${
        this._migrationVersion
      }: ${this._tableName.toLocaleUpperCase()}  TABLE ======`
    );
  }
}

export default BaseMigrationV2;
