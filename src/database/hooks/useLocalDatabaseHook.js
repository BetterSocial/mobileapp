import * as React from 'react';
import {useRecoilState} from 'recoil';

import LocalDatabase from '..';
import LocalDatabaseMigration from '../migration';
import localDatabaseAtom from '../atom/localDatabaseAtom';

const useLocalDatabaseHook = () => {
  /**
   * @type {[import('react-native-sqlite-storage').SQLiteDatabase | null, (value: import('react-native-sqlite-storage').SQLiteDatabase | null) => void]}
   */
  const [localDb, setLocalDb] = useRecoilState(localDatabaseAtom);

  const initDb = async () => {
    const db = await LocalDatabase.getDBConnection();
    await LocalDatabaseMigration.migrateDb();

    setLocalDb(db);
  };

  React.useEffect(() => initDb(), []);

  return {
    localDb
  };
};

export default useLocalDatabaseHook;
