import * as React from 'react';
import {useRecoilState} from 'recoil';

import LocalDatabase from '..';
import LocalDatabaseMigration from '../migration';
import databaseListenerAtom from '../atom/databaseListenerAtom';
import localDatabaseAtom from '../atom/localDatabaseAtom';
import migrationDbStatusAtom from '../atom/migrationDbStatusAtom';
import {InitialStartupAtom} from '../../service/initialStartup';

/**
 *
 * @returns {UseLocalDatabaseHook}
 */
const useLocalDatabaseHook = () => {
  /**
   * @type {[import('react-native-sqlite-storage').SQLiteDatabase | null, (value: import('react-native-sqlite-storage').SQLiteDatabase | null) => void]}
   */
  const [initialStartup] = useRecoilState(InitialStartupAtom);
  const [localDb, setLocalDb] = useRecoilState(localDatabaseAtom);
  const [migrationStatus, setMigrationStatus] = useRecoilState(migrationDbStatusAtom);
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

  const {channelInfo, channelList, channelMember, chat, user} = databaseListener;

  const initDb = async () => {
    const isEnteringApp = Boolean(initialStartup?.id);

    const db = await LocalDatabase.getDBConnection();
    if (isEnteringApp && migrationStatus === 'NOT_MIGRATED') {
      await LocalDatabaseMigration.migrateDb();
      setMigrationStatus('MIGRATED');
    }

    setLocalDb(db);
  };

  React.useEffect(() => {
    initDb();
  }, []);

  return {
    localDb,
    channelInfo,
    channelList,
    channelMember,
    chat,
    user,
    refresh
  };
};

export default useLocalDatabaseHook;
