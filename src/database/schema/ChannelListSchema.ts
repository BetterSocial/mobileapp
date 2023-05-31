import {SQLiteDatabase} from 'react-native-sqlite-storage';

import BaseDbSchema from './BaseDbSchema';
import UserSchema from './UserSchema';

class ChannelList implements BaseDbSchema {
  id: string;

  channelPicture: string;

  name: string;

  description: string;

  unreadCount: number;

  channelType: string;

  lastUpdatedAt: string;

  lastUpdatedBy: string;

  createdAt: string;

  rawJson: any;

  user: UserSchema | null;

  constructor({
    id,
    channelPicture,
    name,
    description,
    unreadCount = 0,
    channelType,
    lastUpdatedAt,
    lastUpdatedBy,
    createdAt,
    rawJson,
    user
  }) {
    if (!id) throw new Error('ChannelList must have an id');

    this.id = id;
    this.channelPicture = channelPicture;
    this.name = name;
    this.description = description;
    this.unreadCount = unreadCount;
    this.channelType = channelType;
    this.lastUpdatedAt = lastUpdatedAt;
    this.lastUpdatedBy = lastUpdatedBy;
    this.createdAt = createdAt;
    this.rawJson = rawJson;
    this.user = user;
  }

  getAll = (db: any): Promise<BaseDbSchema[]> => {
    throw new Error('Method not implemented.');
  };

  getTableName = (): string => {
    throw new Error('Method not implemented.');
  };

  fromDatabaseObject = (dbObject: any): BaseDbSchema => {
    throw new Error('Method not implemented.');
  };

  async save(db: SQLiteDatabase): Promise<void> {
    let jsonString: string | null = null;

    try {
      jsonString = JSON.stringify(this.rawJson);
      db.executeSql(
        `INSERT OR REPLACE INTO ${ChannelList.getTableName()} (
          id,
          channel_picture,
          name,
          description,
          unread_count,
          channel_type,
          last_updated_at,
          last_updated_by,
          created_at,
          raw_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          this.id,
          this.channelPicture,
          this.name,
          this.description,
          this.unreadCount,
          this.channelType,
          this.lastUpdatedAt,
          this.lastUpdatedBy,
          this.createdAt,
          jsonString
        ]
      );
    } catch (e) {
      console.log('zxczczxczxce');
      console.log(e);
    }
  }

  static async getAll(
    db: SQLiteDatabase,
    myId: string,
    myAnonymousId: string
  ): Promise<ChannelList[]> {
    const [results] = await db.executeSql(
      `SELECT *, 
        CASE last_updated_by 
          WHEN ? THEN 1
          WHEN ? THEN 1
          ELSE 0 END AS is_me
      FROM ${ChannelList.getTableName()} A 
      INNER JOIN ${UserSchema.getTableName()} B
      ON A.last_updated_by = B.user_id
      ORDER BY last_updated_at DESC`,
      [myId, myAnonymousId]
    );
    return results.rows.raw().map(ChannelList.fromDatabaseObject);
  }

  static getTableName(): string {
    return 'channel_lists';
  }

  static fromWebsocketObject(json): ChannelList {
    return new ChannelList({
      id: json?.channel?.id,
      channelPicture: '',
      name: json?.channel?.name,
      description: json?.message?.message,
      unreadCount: json?.unread_count,
      channelType: 'ANON_PM',
      lastUpdatedAt: json?.channel?.last_message_at,
      lastUpdatedBy: json?.message?.user?.id,
      createdAt: json.created_at,
      rawJson: json,
      user: null
    });
  }

  static fromDatabaseObject(json): ChannelList {
    let jsonParsed = null;
    try {
      jsonParsed = JSON.parse(json.raw_json);
    } catch (e) {
      console.log(e);
    }

    const user = UserSchema.fromDatabaseObject(json);

    return new ChannelList({
      id: json.id,
      channelPicture: json.channel_picture,
      name: json.name,
      description: json.description,
      unreadCount: json.unread_count,
      channelType: json.channel_type,
      lastUpdatedAt: json.last_updated_at,
      lastUpdatedBy: json.last_updated_by,
      createdAt: json.created_at,
      rawJson: jsonParsed,
      user
    });
  }

  static fromPostNotifObject(json): ChannelList {
    const object = json?.new[0];
    return new ChannelList({
      id: object?.id,
      channelPicture: '',
      name: '',
      description: object?.message,
      unreadCount: 1,
      channelType: 'ANON_POST_NOTIFICATION',
      lastUpdatedAt: object?.time,
      lastUpdatedBy: object?.actor?.id,
      createdAt: object?.time,
      rawJson: json,
      user: null
    });
  }
}

export default ChannelList;
