import {SQLiteDatabase} from 'react-native-sqlite-storage';

import BaseDbSchema from './BaseDbSchema';

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

  constructor({
    userId,
    username,
    countryCode,
    createdAt,
    updatedAt,
    lastActiveAt,
    profilePicture,
    bio,
    isBanned
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
  }

  async save(db: SQLiteDatabase): Promise<void> {
    await db.executeSql(
      `INSERT OR REPLACE INTO ${this.getTableName()} (
        userId,
        username,
        countryCode,
        createdAt,
        updatedAt,
        lastActiveAt,
        profilePicture,
        bio,
        isBanned
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
  }

  static async getAll(db: SQLiteDatabase): Promise<UserSchema[]> {
    const [results] = await db.executeSql(`SELECT * FROM ${this.getTableName()}`);
    return results.rows.raw().map((dbObject) => this.fromDatabaseObject(dbObject));
  }

  static getTableName(): string {
    return 'users';
  }

  static fromDatabaseObject(dbObject: any): UserSchema {
    throw new Error('Method not implemented.');
  }

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
