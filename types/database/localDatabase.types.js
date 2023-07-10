/**
 * @typedef {Object} RefreshAtomParam
 * @property {('channelList'|'channelInfo'|'chat'|'user')} key
 */

/**
 * @typedef {Object} UseLocalDatabaseHook
 * @property {import("react-native-sqlite-storage").SQLiteDatabase} localDb
 * @property {(key: RefreshAtomParam) => void} refresh
 * @property {number} channelInfo
 * @property {number} channelList
 * @property {number} chat
 * @property {number} user
 */
