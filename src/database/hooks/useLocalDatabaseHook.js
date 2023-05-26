import * as React from 'react';
import {enablePromise, openDatabase} from 'react-native-sqlite-storage';
import {useRecoilState} from 'recoil';

import localDatabaseAtom from '../atom/localDatabaseAtom';

const DB_NAME = 'bettersocial.db';
enablePromise(true);

const useLocalDatabaseHook = () => {
  /**
   * @type {[import('react-native-sqlite-storage').SQLiteDatabase | null, (value: import('react-native-sqlite-storage').SQLiteDatabase | null) => void]}
   */
  const [localDb, setLocalDb] = useRecoilState(localDatabaseAtom);

  const getDBConnection = async () => {
    const db = openDatabase(
      {
        name: DB_NAME,
        location: 'default'
      },
      () => {
        console.log('success connecting database');
      },
      (e) => {
        console.log('failed connecting database');
        console.log(e);
      }
    );

    return Promise.resolve(db);
  };

  /**
   *
   * @param {import('react-native-sqlite-storage').SQLiteDatabase} db
   */
  const createTables = async (db) => {
    const query = `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );`;

    await db.executeSql(query);
  };

  const initDb = async () => {
    const db = await getDBConnection();
    await createTables(db);

    setLocalDb(db);
  };

  React.useEffect(() => initDb(), []);

  return {
    localDb
  };
};

export default useLocalDatabaseHook;
