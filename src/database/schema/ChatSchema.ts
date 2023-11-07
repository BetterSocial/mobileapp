import {SQLiteDatabase} from 'react-native-sqlite-storage';
import {v4 as uuid} from 'uuid';

import BaseDbSchema from './BaseDbSchema';
import UserSchema from './UserSchema';
import {ModifyAnonymousChatData} from '../../../types/repo/AnonymousMessageRepo/InitAnonymousChatData';

class ChatSchema implements BaseDbSchema {
  id: string;

  channelId: string;

  userId: string;

  message: string;

  type: string;

  createdAt: string;

  updatedAt: string;

  rawJson: any;

  user: UserSchema | null;

  status: string;

  isMe: boolean;

  isContinuous: boolean;

  constructor({
    id,
    channelId,
    userId,
    message,
    type,
    createdAt,
    updatedAt,
    rawJson,
    user,
    status,
    isMe,
    isContinuous
  }) {
    if (!id) throw new Error('ChatSchema must have an id');

    this.id = id;
    this.channelId = channelId;
    this.userId = userId;
    this.message = message;
    this.type = type;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.rawJson = rawJson;
    this.user = user;
    this.status = status;
    this.isMe = isMe;
    this.isContinuous = isContinuous;
  }

  save = async (db: SQLiteDatabase) => {
    try {
      const insertQuery = `INSERT OR REPLACE INTO ${ChatSchema.getTableName()} (
        id,
        channel_id,
        user_id,
        message,
        type,
        status,
        created_at,
        updated_at,
        raw_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`;

      const insertParams = [
        this.id,
        this.channelId,
        this.userId,
        this.message,
        this.type,
        this.status,
        this.createdAt,
        this.updatedAt,
        this.rawJson
      ];

      await db.executeSql(insertQuery, insertParams);
    } catch (e) {
      console.log('error saving chat schema');
      console.log(e);
    }
  };

  static async getAll(
    db: SQLiteDatabase,
    channelId: string,
    myId: string,
    myAnonymousId: string
  ): Promise<BaseDbSchema[]> {
    const selectQuery = `
      SELECT A.*, 
        B.user_id as user_schema_user_id,
        B.channel_id as user_channel_id, 
        B.username, 
        B.country_code, 
        B.created_at as user_created_at, 
        B.updated_at as user_updated_at, 
        B.last_active_at, 
        B.profile_picture, 
        B.bio, 
        B.is_banned,
        CASE A.user_id 
          WHEN ? THEN 1 
          WHEN ? THEN 1
          ELSE 0 END AS is_me,
        CASE WHEN A.user_id = LAG(A.user_id) OVER (ORDER BY A.created_at) 
          THEN 
            CASE WHEN (julianday(A.created_at) - julianday(LAG(A.created_at) OVER (ORDER BY A.created_at))) * 24 < 1
            THEN 1
            ELSE 0
            END
          ELSE 0 END AS is_continuous
      FROM 
      ${ChatSchema.getTableName()} A 
      INNER JOIN ${UserSchema.getTableName()} B 
      ON A.user_id = user_schema_user_id AND A.channel_id = user_channel_id
      WHERE A.channel_id = ? ORDER BY created_at DESC;`;

    const [{rows}] = await db.executeSql(selectQuery, [myId, myAnonymousId, channelId]);
    return Promise.resolve(rows.raw().map(this.fromDatabaseObject));
  }

  static async getByid(db: SQLiteDatabase, id: string): Promise<ChatSchema> {
    const selectQuery = `SELECT A.*,
      B.username, 
      B.country_code, 
      B.created_at as user_created_at, 
      B.updated_at as user_updated_at, 
      B.last_active_at, 
      B.profile_picture, 
      B.bio, 
      B.is_banned
      FROM ${ChatSchema.getTableName()} A
      INNER JOIN ${UserSchema.getTableName()} B
      ON A.user_id = B.user_id
      WHERE A.id = ?;`;

    const [{rows}] = await db.executeSql(selectQuery, [id]);
    if (rows.length === 0) return Promise.resolve(null);
    return Promise.resolve(this.fromDatabaseObject(rows.raw()[0]));
  }

  static getTableName(): string {
    return 'chats';
  }

  static fromDatabaseObject(dbObject: any): ChatSchema {
    let rawJson = null;

    try {
      rawJson = JSON.parse(dbObject?.raw_json || '{}');
    } catch (e) {
      console.log('error parse');
      console.log(e);
    }
    const user = UserSchema.fromDatabaseObject(dbObject);

    return new ChatSchema({
      id: dbObject.id,
      channelId: dbObject.channel_id,
      userId: dbObject?.user_id,
      message: dbObject.message,
      type: dbObject.type,
      createdAt: dbObject.created_at,
      updatedAt: dbObject.updated_at,
      rawJson,
      user,
      status: dbObject.status,
      isMe: dbObject.is_me,
      isContinuous: dbObject.is_continuous
    });
  }

  static fromWebsocketObject(json): ChatSchema {
    let rawJson = null;

    try {
      rawJson = JSON.stringify(json);
    } catch (e) {
      console.log('error stringify');
      console.log(e);
    }

    return new ChatSchema({
      id: json?.message?.id,
      channelId: json?.channel_id,
      userId: json?.message?.user?.id,
      message: json?.message?.text || json?.message?.message,
      type: json?.message?.type,
      createdAt: json?.message?.created_at,
      updatedAt: json?.message?.created_at,
      rawJson,
      user: null,
      status: 'sent',
      isMe: false,
      isContinuous: false
    });
  }

  static fromGetAllChannelAPI(channelId, json): ChatSchema {
    let rawJson = null;

    try {
      rawJson = JSON.stringify(json);
    } catch (e) {
      console.log('error stringify');
      console.log(e);
    }

    return new ChatSchema({
      id: json?.id,
      channelId,
      userId: json?.user?.id,
      message: (json?.text || json?.message) ?? '',
      type: json?.type,
      createdAt: json?.created_at,
      updatedAt: json?.created_at,
      rawJson,
      user: null,
      status: 'sent',
      isMe: false,
      isContinuous: false
    });
  }

  static fromGetAllAnonymousChannelAPI(channelId, json): ChatSchema {
    let rawJson = null;

    try {
      rawJson = JSON.stringify(json);
    } catch (e) {
      console.log('error stringify');
      console.log(e);
    }

    return new ChatSchema({
      id: json?.id,
      channelId,
      userId: json?.user?.id,
      message: json?.text || json?.message,
      type: json?.type,
      createdAt: json?.created_at,
      updatedAt: json?.created_at,
      rawJson,
      user: null,
      status: 'sent',
      isMe: false,
      isContinuous: false
    });
  }

  static async generateSendingChat(
    id: string,
    userId: string,
    channelId: string,
    message: string,
    localDb: SQLiteDatabase,
    type: 'regular' | 'system' = 'regular',
    status: 'pending' | 'sent' = 'pending'
  ): Promise<ChatSchema> {
    let newRandomId = id;
    const existingChat = await ChatSchema.getByid(localDb, newRandomId);
    if (existingChat) {
      newRandomId = uuid();
    }

    return new ChatSchema({
      channelId,
      message,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      id: newRandomId,
      type,
      rawJson: null,
      user: null,
      userId,
      isMe: true,
      isContinuous: true
    });
  }

  static fromInitAnonymousChatAPI(data: ModifyAnonymousChatData, status = 'sent'): ChatSchema {
    let rawJson = null;

    try {
      rawJson = JSON.stringify(data);
    } catch (e) {
      console.log('error stringify');
      console.log(e);
    }

    return new ChatSchema({
      id: data?.message?.id,
      channelId: data?.message?.cid,
      createdAt: data?.message?.created_at,
      updatedAt: data?.message?.updated_at,
      isMe: true,
      message: data?.message?.message,
      rawJson,
      status,
      isContinuous: false,
      type: 'regular',
      user: null,
      userId: data?.message?.user?.id
    });
  }

  updateChatSentStatus = async (db: SQLiteDatabase, response: any) => {
    try {
      const updateQuery = `UPDATE ${ChatSchema.getTableName()}
        SET status = ?, created_at = ?, updated_at = ?, raw_json = ?, id = ?
        WHERE id = ?;`;

      const updateReplacement = [
        'sent',
        response?.message?.created_at,
        response?.message?.updated_at,
        JSON.stringify(response),
        response?.message?.id,
        this.id
      ];

      await db.executeSql(updateQuery, updateReplacement);
    } catch (e) {
      console.log('error updatedRandomId', this.id, response?.message?.id);
      console.log('error updating chat status');
      console.log(e);
    }
  };

  static clearAll = async (db: SQLiteDatabase): Promise<void> => {
    const query = `DELETE FROM ${ChatSchema.getTableName()}`;
    await db.executeSql(query);
  };

  getAll = (db: any): Promise<BaseDbSchema[]> => {
    throw new Error('Method not implemented. 1');
  };

  getTableName = (): string => {
    throw new Error('Method not implemented. 2');
  };

  fromDatabaseObject = (dbObject: any): BaseDbSchema => {
    throw new Error('Method not implemented. 3');
  };
}

export default ChatSchema;
