import {SQLiteDatabase} from 'react-native-sqlite-storage';

import BaseDbSchema from './BaseDbSchema';

class ChatSchema implements BaseDbSchema {
  id: string;

  channelId: string;

  userId: string;

  message: string;

  type: string;

  createdAt: string;

  updatedAt: string;

  rawJson: string;

  constructor({id, channelId, userId, message, type, createdAt, updatedAt, rawJson}) {
    if (!id) throw new Error('ChatSchema must have an id');

    this.id = id;
    this.channelId = channelId;
    this.userId = userId;
    this.message = message;
    this.type = type;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.rawJson = rawJson;
  }

  save = async (db: SQLiteDatabase) => {
    try {
      const insertQuery = `INSERT OR REPLACE INTO ${ChatSchema.getTableName()} (
        id,
        channel_id,
        user_id,
        message,
        type,
        created_at,
        updated_at,
        raw_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;

      const insertParams = [
        this.id,
        this.channelId,
        this.userId,
        this.message,
        this.type,
        this.createdAt,
        this.updatedAt,
        this.rawJson
      ];

      await db.executeSql(insertQuery, insertParams);
    } catch (e) {
      console.log('poppoopo');
      console.log(e);
    }
  };

  static async getAll(db: SQLiteDatabase, channelId): Promise<BaseDbSchema[]> {
    const selectQuery = `SELECT * FROM ${ChatSchema.getTableName()} WHERE channel_id = ? ORDER BY created_at ASC;`;

    const [{rows}] = await db.executeSql(selectQuery, [channelId]);
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
      console.log(e);
    }

    return new ChatSchema({
      id: dbObject.id,
      channelId: dbObject.channel_id,
      userId: dbObject.user_id,
      message: dbObject.message,
      type: dbObject.type,
      createdAt: dbObject.created_at,
      updatedAt: dbObject.updated_at,
      rawJson
    });
  }

  static fromWebsocketObject(json): ChatSchema {
    let rawJson = null;

    try {
      rawJson = JSON.stringify(json);
    } catch (e) {
      console.log(e);
    }

    console.log('json', json?.message?.id);
    return new ChatSchema({
      id: json?.message?.id,
      channelId: json?.channel_id,
      userId: json?.message?.user?.id,
      message: json?.message?.message,
      type: json?.message?.type,
      createdAt: json?.message?.created_at,
      updatedAt: json?.message?.created_at,
      rawJson
    });
  }

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
