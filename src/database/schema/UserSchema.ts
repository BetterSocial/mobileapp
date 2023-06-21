import {SQLiteDatabase} from 'react-native-sqlite-storage';

import BaseDbSchema from './BaseDbSchema';
import ChatSchema from './ChatSchema';

class UserSchema implements BaseDbSchema {
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
  }

  save = async (db: SQLiteDatabase): Promise<void> => {
    try {
      await db.executeSql(
        `INSERT OR REPLACE INTO ${UserSchema.getTableName()} (
        user_id,
        username,
        country_code,
        created_at,
        updated_at,
        last_active_at,
        profile_picture,
        bio,
        is_banned
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          this.userId,
          this.username,
          this.countryCode,
          this.createdAt,
          this.updatedAt,
          this.lastActiveAt,
          this.profilePicture,
          this.bio,
          this.isBanned
        ]
      );
    } catch (e) {
      console.log(e);
    }
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

  static fromMemberWebsocketObject(json: any): UserSchema {
    return new UserSchema({
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
