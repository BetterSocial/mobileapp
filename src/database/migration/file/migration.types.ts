import {SQLiteDatabase} from 'react-native-sqlite-storage';

interface Migration {
  up(db: SQLiteDatabase): Promise<void>;
  down(db: SQLiteDatabase): Promise<void>;
}

export default Migration;
