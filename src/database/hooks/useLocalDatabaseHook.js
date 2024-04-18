import * as React from 'react';
import _ from 'lodash';
import {useRecoilState} from 'recoil';

import LocalDatabase from '..';
import LocalDatabaseMigration from '../migration';
import databaseListenerAtom from '../atom/databaseListenerAtom';
import localDatabaseAtom from '../atom/localDatabaseAtom';
import migrationDbStatusAtom from '../atom/migrationDbStatusAtom';

const MIGRATION_STATUS = {
  NOT_MIGRATED: 'NOT_MIGRATED',
  MIGRATED: 'MIGRATED',
  MIGRATING: 'MIGRATING'
};

/**
 * @callback RefreshDBParam
 * @param {'channelList' | 'channelInfo' | 'chat' | 'user' | 'channelMember'} key
 * @returns {void}
 */

/**
 * @callback RefreshDBWithIdParam
 * @param {'channelList' | 'channelInfo' | 'chat' | 'user' | 'channelMember'} key
 * @param {string} id
 * @returns {void}
 */

/**
 * @typedef {Object} useLocalDatabaseHook
 * @property {import('react-native-sqlite-storage').SQLiteDatabase} localDb
 * @property {RefreshDBParam} refresh
 * @property {RefreshDBWithIdParam} refreshWithId
 * @property {number} channelInfo
 * @property {number} channelList
 * @property {number} chat
 * @property {number} user
 * @property {number} channelMember
 */

/**
 *
 * @returns {useLocalDatabaseHook}
 */
const useLocalDatabaseHook = (withMigration = false) => {
  /**
   * @type {[import('react-native-sqlite-storage').SQLiteDatabase | null, (value: import('react-native-sqlite-storage').SQLiteDatabase | null) => void]}
   */
  const [localDb, setLocalDb] = useRecoilState(localDatabaseAtom);
  const [migrationStatus, setMigrationStatus] = useRecoilState(migrationDbStatusAtom);
  const [databaseListener, setDatabaseListener] = useRecoilState(databaseListenerAtom);

  /**
   *
   * @param {'channelList' | 'channelInfo' | 'chat' | 'user' | channelMember} key
   */
  const refresh = (key) => {
    setDatabaseListener((prev) => ({
      ...prev,
      [key]: new Date().getTime()
    }));
  };

  const debouncedRefresh = React.useCallback(
    _.debounce((key) => refresh(key), 50),
    []
  );

  const refreshWithId = (key, id) => {
    const keyWithId = `${key}_${id}`;
    debouncedRefresh(keyWithId);
  };

  const {channelInfo, channelList, channelMember, chat, user, ...otherListener} = databaseListener;

  const initDb = async () => {
    const db = await LocalDatabase.getDBConnection();
    const shouldDbMigrated = await LocalDatabaseMigration.shouldDbMigrated();
    let scopedMigrationStatus = migrationStatus;

    if (scopedMigrationStatus === MIGRATION_STATUS.MIGRATING) {
      return null;
    }

    if (shouldDbMigrated) {
      setMigrationStatus(MIGRATION_STATUS.MIGRATING);
      if (withMigration) await LocalDatabaseMigration.migrateDb();
      setMigrationStatus(MIGRATION_STATUS.MIGRATED);
      scopedMigrationStatus = MIGRATION_STATUS.MIGRATED;
    }

    if (scopedMigrationStatus === MIGRATION_STATUS.NOT_MIGRATED) {
      setMigrationStatus(MIGRATION_STATUS.MIGRATING);
      if (withMigration) await LocalDatabaseMigration.migrateDb();
      setMigrationStatus(MIGRATION_STATUS.MIGRATED);
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
    otherListener,
    refresh,
    refreshWithId
  };
};

export default useLocalDatabaseHook;
