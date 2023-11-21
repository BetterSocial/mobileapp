import {SQLiteDatabase} from 'react-native-sqlite-storage';

interface BaseDbSchema {
  save(db: SQLiteDatabase): Promise<void>;
  saveIfNotExist(db: SQLiteDatabase): Promise<void>;
  getAll(db: SQLiteDatabase): Promise<BaseDbSchema[]>;
  getTableName(): string;
  fromDatabaseObject(dbObject: any): BaseDbSchema;
}

export default BaseDbSchema;
