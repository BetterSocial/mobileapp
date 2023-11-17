import {SQLiteDatabase, Transaction} from 'react-native-sqlite-storage';

import BaseDbSchema from './BaseDbSchema';
import UserSchema from './UserSchema';
import {InitAnonymousChatDataMember} from '../../../types/repo/AnonymousMessageRepo/InitAnonymousChatData';

class ChannelListMemberSchema implements BaseDbSchema {
  id: string;

  channelId: string;

  userId: string;

  isModerator: boolean;

  isBanned: boolean;

  isShadowBanned: boolean;

  joinedAt: string;

  user: UserSchema | null;

  constructor({id, channelId, userId, isModerator, isBanned, isShadowBanned, joinedAt, user}) {
    this.id = id;
    this.channelId = channelId;
    this.userId = userId;
    this.isModerator = isModerator;
    this.isBanned = isBanned;
    this.isShadowBanned = isShadowBanned;
    this.joinedAt = joinedAt;
    this.user = user;
  }

  save = async (db: SQLiteDatabase, transaction: Transaction = null): Promise<void> => {
    const isExist = await this.checkIfExist(db);
    if (isExist) return;

    const insertQuery = `INSERT OR REPLACE INTO ${ChannelListMemberSchema.getTableName()} (
        id,
        channel_id,
        user_id,
        is_moderator,
        is_banned,
        is_shadow_banned,
        joined_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?);`;

    const insertParams = [
      this.id,
      this.channelId,
      this.userId,
      this.isModerator,
      this.isBanned,
      this.isShadowBanned,
      this.joinedAt
    ];

    try {
      if (transaction) {
        transaction.executeSql(insertQuery, insertParams);
      } else {
        db.executeSql(insertQuery, insertParams);
      }
    } catch (e) {
      console.log('save channellistmember error', e);
    }
  };

  saveIfNotExist = async (db: SQLiteDatabase): Promise<void> => {
    const ifExists = await this.checkIfExist(db);
    if (ifExists) return;

    this.save(db);
  };

  checkIfExist = async (db: SQLiteDatabase): Promise<boolean> => {
    const checkQuery = `SELECT id FROM ${ChannelListMemberSchema.getTableName()} WHERE channel_id = ? AND user_id = ?`;
    const checkParams = [this.channelId, this.userId];

    try {
      const [results] = await db.executeSql(checkQuery, checkParams);
      return Promise.resolve(results.rows.length > 0);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  static async getAll(
    db: SQLiteDatabase,
    channelId: string,
    myId: string,
    myAnonymousId: string
  ): Promise<ChannelListMemberSchema[]> {
    const selectQuery = `
        SELECT A.*,
            B.user_id as user_schema_user_id,
            B.channel_id as user_schema_channel_id,
            B.username,
            B.country_code,
            B.profile_picture,
            B.bio,
            B.is_banned,
            B.last_active_at,
            CASE A.user_id 
                WHEN ? THEN true
                WHEN ? THEN true
                ELSE FALSE END AS is_me
        FROM ${ChannelListMemberSchema.getTableName()} A
        INNER JOIN ${UserSchema.getTableName()} B
        ON A.user_id = user_schema_user_id AND A.channel_id = user_schema_channel_id
        WHERE A.channel_id = ?`;
    const selectParams = [myId, myAnonymousId, channelId];

    try {
      const [results] = await db.executeSql(selectQuery, selectParams);
      return Promise.resolve(results.rows.raw().map(this.fromDatabaseObject));
    } catch (e) {
      return Promise.reject(e);
    }
  }

  static getTableName(): string {
    return 'channel_list_members';
  }

  static fromDatabaseObject(dbObject: any): ChannelListMemberSchema {
    return new ChannelListMemberSchema({
      id: dbObject.id,
      channelId: dbObject.channel_id,
      userId: dbObject.user_id,
      isModerator: dbObject.is_moderator,
      isBanned: dbObject.is_banned,
      isShadowBanned: dbObject.is_shadow_banned,
      joinedAt: dbObject.joined_at,
      user: UserSchema.fromDatabaseObject(dbObject)
    });
  }

  static clearAll = async (db: SQLiteDatabase): Promise<void> => {
    const query = `DELETE FROM ${ChannelListMemberSchema.getTableName()}`;
    await db.executeSql(query);
  };

  getAll = (db: SQLiteDatabase): Promise<BaseDbSchema[]> => {
    throw new Error('Method not implemented.');
  };

  getTableName = (): string => {
    throw new Error('Method not implemented.');
  };

  fromDatabaseObject = (dbObject: any): BaseDbSchema => {
    throw new Error('Method not implemented.');
  };

  static fromWebsocketObject = (
    channelId: string,
    messageId: string,
    member: any
  ): ChannelListMemberSchema => {
    return new ChannelListMemberSchema({
      channelId,
      id: messageId,
      userId: member?.user?.id,
      isModerator: member.is_moderator,
      isBanned: member.banned,
      isShadowBanned: member.shadow_banned,
      joinedAt: member.updated_at,
      user: null
    });
  };

  static fromMessageAnonymousChatAPI = ChannelListMemberSchema.fromWebsocketObject;

  static fromInitAnonymousChatAPI = (
    channelId: string,
    messageId: string,
    member: InitAnonymousChatDataMember
  ): ChannelListMemberSchema => {
    return new ChannelListMemberSchema({
      channelId,
      id: messageId,
      userId: member?.user_id,
      isModerator: false,
      isBanned: member?.is_banned,
      isShadowBanned: false,
      joinedAt: member?.updated_at,
      user: null
    });
  };
}

export default ChannelListMemberSchema;
