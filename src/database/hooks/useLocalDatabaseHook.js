import * as React from 'react';
import {useRecoilState} from 'recoil';

import LocalDatabase from '..';
import LocalDatabaseMigration from '../migration';
import databaseListenerAtom from '../atom/databaseListenerAtom';
import localDatabaseAtom from '../atom/localDatabaseAtom';

/**
 *
 * @returns {UseLocalDatabaseHook}
 */
const useLocalDatabaseHook = () => {
  /**
   * @type {[import('react-native-sqlite-storage').SQLiteDatabase | null, (value: import('react-native-sqlite-storage').SQLiteDatabase | null) => void]}
   */
  const [localDb, setLocalDb] = useRecoilState(localDatabaseAtom);
  const [databaseListener, setDatabaseListener] = useRecoilState(databaseListenerAtom);

  /**
   *
   * @param {RefreshAtomParam} key
   */
  const refresh = (key) => {
    setDatabaseListener((prev) => ({
      ...prev,
      [key]: new Date().getTime()
    }));
  };

  const {channelInfo, channelList, chat, user} = databaseListener;

  const initDb = async () => {
    const db = await LocalDatabase.getDBConnection();
    await LocalDatabaseMigration.migrateDb();

    setLocalDb(db);
  };

  React.useEffect(() => initDb(), []);

  return {
    localDb,
    channelInfo,
    channelList,
    chat,
    user,
    refresh
  };
};

export default useLocalDatabaseHook;
