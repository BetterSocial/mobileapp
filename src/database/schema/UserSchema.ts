import {ResultSet, SQLiteDatabase, Transaction} from 'react-native-sqlite-storage';
import {v4 as uuidv4} from 'uuid';

import BaseDbSchema from './BaseDbSchema';
import {DEFAULT_PROFILE_PIC_PATH} from '../../utils/constants';
import {InitAnonymousChatDataMember} from '../../../types/repo/AnonymousMessageRepo/InitAnonymousChatData';

export type SQLiteBoolean = 0 | 1;
class UserSchema implements BaseDbSchema {
  id: string;

  channelId: string;

  userId: string;

  username: string;

  countryCode: string;

  createdAt: string;

  updatedAt: string;

  lastActiveAt: string;

  profilePicture: string;

  bio: string;

  isBanned: boolean | null;

  isMe: boolean;

  anon_user_info_emoji_name: string | null;

  anon_user_info_emoji_code: string | null;

  anon_user_info_color_name: string | null;

  anon_user_info_color_code: string | null;

  isAnonymous: SQLiteBoolean | null;

  constructor({
    id,
    channelId,
    userId,
    username,
    countryCode,
    createdAt,
    updatedAt,
    lastActiveAt,
    profilePicture,
    bio,
    isBanned,
    isMe = false,
    anon_user_info_emoji_name = null,
    anon_user_info_emoji_code = null,
    anon_user_info_color_name = null,
    anon_user_info_color_code = null,
    isAnonymous = null
  }) {
    this.userId = userId;
    this.username = username;
    this.countryCode = countryCode;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.lastActiveAt = lastActiveAt;
    this.profilePicture = profilePicture;
    this.bio = bio;
    this.isBanned = isBanned;
    this.isMe = isMe;
    this.id = id;
    this.channelId = channelId;
    this.anon_user_info_emoji_name = anon_user_info_emoji_name;
    this.anon_user_info_emoji_code = anon_user_info_emoji_code;
    this.anon_user_info_color_name = anon_user_info_color_name;
    this.anon_user_info_color_code = anon_user_info_color_code;
    this.isAnonymous = isAnonymous;
  }

  save = async (db: SQLiteDatabase, transaction?: Transaction): Promise<void> => {
    try {
      const query = `
      INSERT OR REPLACE INTO ${UserSchema.getTableName()} (
        id,
        channel_id,
        user_id,
        username,
        country_code,
        created_at,
        updated_at,
        last_active_at,
        profile_picture,
        bio,
        is_banned,
        anon_user_info_emoji_name,
        anon_user_info_emoji_code,
        anon_user_info_color_name,
        anon_user_info_color_code,
        is_anonymous
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

      const prepReplacement = [
        this.id,
        this.channelId,
        this.userId,
        this.username,
        this.countryCode,
        this.createdAt,
        this.updatedAt,
        this.lastActiveAt,
        this.profilePicture,
        this.bio,
        this.isBanned,
        this.anon_user_info_emoji_name,
        this.anon_user_info_emoji_code,
        this.anon_user_info_color_name,
        this.anon_user_info_color_code,
        this.isAnonymous
      ];

      if (transaction) {
        await transaction.executeSql(query, prepReplacement);
      } else {
        await db.executeSql(query, prepReplacement);
      }
    } catch (e) {
      console.log(e);
    }
  };

  update = async (db: SQLiteDatabase, transaction?: Transaction): Promise<void> => {
    try {
      const query = `UPDATE ${UserSchema.getTableName()}
      SET
        channel_id = ?,
        user_id = ?,
        username = ?,
        country_code = ?,
        created_at = ?,
        updated_at = ?,
        last_active_at = ?,
        profile_picture = ?,
        bio = ?,
        is_banned = ?,
        anon_user_info_emoji_name = ?,
        anon_user_info_emoji_code = ?,
        anon_user_info_color_name = ?,
        anon_user_info_color_code = ?,
        is_anonymous = ?
      WHERE
        channel_id = ? AND user_id = ?`;

      const prepReplacement = [
        this.channelId,
        this.userId,
        this.username,
        this.countryCode,
        this.createdAt,
        this.updatedAt,
        this.lastActiveAt,
        this.profilePicture,
        this.bio,
        this.isBanned,
        this.anon_user_info_emoji_name,
        this.anon_user_info_emoji_code,
        this.anon_user_info_color_name,
        this.anon_user_info_color_code,
        this.isAnonymous,
        this.channelId,
        this.userId
      ];

      if (transaction) {
        await transaction.executeSql(query, prepReplacement);
      } else {
        await db.executeSql(query, prepReplacement);
      }
    } catch (e) {
      console.log(e);
    }
  };

  isUserExists = async (
    db: SQLiteDatabase,
    userId: string,
    channelId: string,
    transaction?: Transaction
  ): Promise<boolean> => {
    try {
      const query = `SELECT * FROM ${UserSchema.getTableName()} WHERE user_id = ? AND channel_id = ? LIMIT 1`;
      let results: ResultSet;
      if (transaction) {
        [, results] = await transaction.executeSql(query, [userId, channelId]);
      } else {
        [results] = await db.executeSql(query, [userId, channelId]);
      }

      return results?.rows?.length > 0;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  saveOrUpdateIfExists = async (db: SQLiteDatabase): Promise<void> => {
    const resolver = (tx: Transaction) => {
      const query = `SELECT * FROM ${UserSchema.getTableName()} WHERE user_id = ? AND channel_id = ? LIMIT 1`;
      tx.executeSql(query, [this.userId, this.channelId], (isExistsTx, results) => {
        const isExists = results?.rows?.length > 0;
        if (isExists) {
          this.update(db, isExistsTx);
        } else {
          this.save(db, isExistsTx);
        }
      });
    };

    try {
      db.transaction(resolver);
    } catch (e) {
      console.log('error resolver', e);
    }
  };

  static async getSelfAnonUserInfo(
    db: SQLiteDatabase,
    selfAnonUserId: string,
    channelId: string
  ): Promise<UserSchema> {
    const [results] = await db.executeSql(
      `SELECT * FROM ${UserSchema.getTableName()} WHERE channel_id = ? AND user_id = ? LIMIT 1`,
      [channelId, selfAnonUserId]
    );
    return results.rows.raw().map((dbObject) => this.fromDatabaseObject(dbObject))[0];
  }

  static async getAll(db: SQLiteDatabase): Promise<UserSchema[]> {
    const [results] = await db.executeSql(`SELECT * FROM ${UserSchema.getTableName()}`);
    return results.rows.raw().map((dbObject) => this.fromDatabaseObject(dbObject));
  }

  static async getAllByChannelId(
    db: SQLiteDatabase,
    channelId: string,
    selfSignedUserId: string,
    selfAnonUserId: string
  ): Promise<UserSchema[]> {
    const query = `
    SELECT
      B.*,
      CASE B.user_id 
          WHEN ? THEN true
          WHEN ? THEN true
          ELSE FALSE END AS is_me
    FROM users B
    WHERE B.channel_id = ?`;

    const selectParams = [selfSignedUserId, selfAnonUserId, channelId];

    try {
      const [results] = await db.executeSql(query, selectParams);
      return Promise.resolve(results.rows.raw().map(this.fromDatabaseObject));
    } catch (e) {
      return Promise.reject(e);
    }
  }

  static getTableName(): string {
    return 'users';
  }

  static fromDatabaseObject(dbObject: any): UserSchema {
    return new UserSchema({
      id: dbObject?.id,
      channelId: dbObject?.channel_id,
      userId: dbObject?.user_id,
      username: dbObject.username,
      countryCode: dbObject.country_code,
      createdAt: dbObject.created_at,
      updatedAt: dbObject.updated_at,
      lastActiveAt: dbObject.last_active_at,
      profilePicture: dbObject.profile_picture || DEFAULT_PROFILE_PIC_PATH,
      bio: dbObject.bio,
      isBanned: dbObject.is_banned,
      isMe: dbObject.is_me,
      anon_user_info_color_code: dbObject.anon_user_info_color_code,
      anon_user_info_color_name: dbObject.anon_user_info_color_name,
      anon_user_info_emoji_code: dbObject.anon_user_info_emoji_code,
      anon_user_info_emoji_name: dbObject.anon_user_info_emoji_name
    });
  }

  static fromWebsocketObject(json: any): UserSchema {
    return new UserSchema({
      id: uuidv4(),
      channelId: json?.message?.cid?.replace('messaging:', ''),
      userId: json?.message?.user?.id,
      username: json?.message?.user?.name,
      countryCode: '',
      createdAt: json?.message?.created_at,
      updatedAt: json?.message?.updated_at,
      lastActiveAt: json?.message?.user?.last_active_at,
      profilePicture: json?.message?.user?.image,
      bio: '',
      isBanned: json.is_banned
    });
  }

  static fromMemberWebsocketObject(json: any, channelId: string): UserSchema {
    try {
      return new UserSchema({
        id: uuidv4(),
        channelId,
        userId: json?.user?.id,
        username: json?.user?.name,
        countryCode: '',
        createdAt: json?.user?.created_at,
        updatedAt: json?.updated_at,
        lastActiveAt: json?.user?.last_active,
        profilePicture: json?.user?.image,
        bio: '',
        isBanned: json?.banned,
        anon_user_info_color_code: json?.anon_user_info_color_code,
        anon_user_info_color_name: json?.anon_user_info_color_name,
        anon_user_info_emoji_code: json?.anon_user_info_emoji_code,
        anon_user_info_emoji_name: json?.anon_user_info_emoji_name
        // TODO: add is_anonymous
      });
    } catch (e) {
      console.log('error on fromMemberWebsocketObject', e);
      return new UserSchema({
        id: uuidv4(),
        channelId,
        userId: null,
        username: null,
        countryCode: null,
        createdAt: null,
        updatedAt: null,
        lastActiveAt: null,
        profilePicture: null,
        bio: null,
        isBanned: null,
        anon_user_info_color_code: null,
        anon_user_info_color_name: null,
        anon_user_info_emoji_code: null,
        anon_user_info_emoji_name: null
        // TODO: add is_anonymous
      });
    }
  }

  static fromInitAnonymousChatAPI(
    object: InitAnonymousChatDataMember,
    channelId: string
  ): UserSchema {
    return new UserSchema({
      id: uuidv4(),
      channelId,
      userId: object?.user_id,
      bio: object?.bio,
      countryCode: object?.country_code,
      createdAt: object?.created_at,
      lastActiveAt: object?.last_active_at,
      profilePicture: object?.profile_pic_path,
      updatedAt: object?.updated_at,
      username: object?.username,
      isBanned: object?.is_banned,
      anon_user_info_color_code: object?.anon_user_info_color_code,
      anon_user_info_color_name: object?.anon_user_info_color_name,
      anon_user_info_emoji_code: object?.anon_user_info_emoji_code,
      anon_user_info_emoji_name: object?.anon_user_info_emoji_name
      // TODO: add is_anonymous
    });
  }

  static clearAll = async (db: SQLiteDatabase): Promise<void> => {
    const query = `DELETE FROM ${UserSchema.getTableName()}`;
    await db.executeSql(query);
  };

  get = async (db: SQLiteDatabase, id: string): Promise<UserSchema> => {
    const [{rows}] = await db.executeSql('SELECT * FROM users WHERE id = ?', [id]);
    if (rows?.length === 0) return null;
    return Promise.resolve(UserSchema.fromDatabaseObject(rows[0].raw()[0]));
  };

  getAll = (db: any): Promise<UserSchema[]> => {
    throw new Error('Method not implemented.');
  };

  getTableName = (): string => {
    throw new Error('Method not implemented.');
  };

  fromDatabaseObject = (dbObject: any): UserSchema => {
    throw new Error('Method not implemented.');
  };
}

export default UserSchema;
