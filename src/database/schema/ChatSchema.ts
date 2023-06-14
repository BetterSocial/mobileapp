import {SQLiteDatabase} from 'react-native-sqlite-storage';

import BaseDbSchema from './BaseDbSchema';
import UserSchema from './UserSchema';

class ChatSchema implements BaseDbSchema {
  id: string;

  channelId: string;

  userId: string;

  message: string;

  type: string;

  createdAt: string;

  updatedAt: string;

  rawJson: string;

  user: UserSchema | null;

  status: string;

  constructor({id, channelId, userId, message, type, createdAt, updatedAt, rawJson, user, status}) {
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
      SELECT *, 
        CASE A.user_id 
          WHEN ? THEN 1 
          WHEN ? THEN 1
          ELSE 0 END AS is_me
      FROM 
      ${ChatSchema.getTableName()} A 
      INNER JOIN ${UserSchema.getTableName()} B 
      ON A.user_id = B.user_id
      WHERE channel_id = ? ORDER BY created_at DESC;`;

    const [{rows}] = await db.executeSql(selectQuery, [myId, myAnonymousId, channelId]);
    return Promise.resolve(rows.raw().map(this.fromDatabaseObject));
  }

  static getTableName(): string {
    return 'chats';
  }

  static fromDatabaseObject(dbObject: any): ChatSchema {
    let rawJson = null;

    try {
      rawJson = JSON.parse(dbObject.raw_json);
    } catch (e) {
      console.log('error parse');
      console.log(e);
    }
    const user = UserSchema.fromDatabaseObject(dbObject);

    return new ChatSchema({
      id: dbObject.id,
      channelId: dbObject.channel_id,
      userId: dbObject.user_id,
      message: dbObject.message,
      type: dbObject.type,
      createdAt: dbObject.created_at,
      updatedAt: dbObject.updated_at,
      rawJson,
      user,
      status: dbObject.status
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
      status: 'sent'
    });
  }

  static generateSendingChat(
    id: string,
    userId: string,
    channelId: string,
    message: string
  ): ChatSchema {
    return new ChatSchema({
      channelId,
      message,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      id,
      type: 'regular',
      rawJson: null,
      user: null,
      userId
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
      console.log('error updating chat status');
      console.log(e);
    }
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
