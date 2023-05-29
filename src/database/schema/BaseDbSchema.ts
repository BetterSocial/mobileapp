import { SQLiteDatabase } from "react-native-sqlite-storage";

interface BaseDbSchema {
    save(db: SQLiteDatabase): any;

    getAll(db: any): Promise<BaseDbSchema[]>;
    getTableName(): string;
    fromDatabaseObject(dbObject: any): BaseDbSchema;
}

export default BaseDbSchema;