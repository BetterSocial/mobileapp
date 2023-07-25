import {ResultSet, SQLiteDatabase, Transaction} from 'react-native-sqlite-storage';
import {v4 as uuidv4} from 'uuid';

import BaseDbSchema from './BaseDbSchema';
import {InitAnonymousChatDataMember} from '../../../types/repo/AnonymousMessageRepo/InitAnonymousChatData';

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

  isBanned: boolean;

  isMe: boolean;

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
    isMe = false
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
        is_banned
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

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
        this.isBanned
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
        is_banned = ?
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

    db.transaction(resolver);
  };

  static async getAll(db: SQLiteDatabase): Promise<UserSchema[]> {
    const [results] = await db.executeSql(`SELECT * FROM ${UserSchema.getTableName()}`);
    return results.rows.raw().map((dbObject) => this.fromDatabaseObject(dbObject));
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
      profilePicture: dbObject.profile_picture,
      bio: dbObject.bio,
      isBanned: dbObject.is_banned,
      isMe: dbObject.is_me
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
      isBanned: json?.banned
    });
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
      isBanned: object?.is_banned
    });
  }

  static clearAll = async (db: SQLiteDatabase): Promise<void> => {
    const query = `DELETE FROM ${UserSchema.getTableName()}`;
    await db.executeSql(query);
  };

  get = async (db: SQLiteDatabase, id: string): Promise<UserSchema> => {
    const [{rows}] = await db.executeSql('SELECT * FROM users WHERE id = ?', [id]);
    if (rows?.length === 0) return null;
    return Promise.resolve(rows[0].raw().map(this.fromDatabaseObject));
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
