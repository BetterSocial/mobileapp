import {SQLiteDatabase} from 'react-native-sqlite-storage';

import BaseDbSchema from './BaseDbSchema';

class ChannelList implements BaseDbSchema {
  id: string;

  channelPicture: string;

  name: string;

  description: string;

  unreadCount: number;

  channelType: string;

  lastUpdatedAt: string;

  createdAt: string;

  rawJson: any;

  constructor({
    id,
    channelPicture,
    name,
    description,
    unreadCount = 0,
    channelType,
    lastUpdatedAt,
    createdAt,
    rawJson
  }) {
    if (!id) throw new Error('ChannelList must have an id');

    this.id = id;
    this.channelPicture = channelPicture;
    this.name = name;
    this.description = description;
    this.unreadCount = unreadCount;
    this.channelType = channelType;
    this.lastUpdatedAt = lastUpdatedAt;
    this.createdAt = createdAt;
    this.rawJson = rawJson;
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

  save(db: SQLiteDatabase): void {
    let jsonString: string | null = null;

    try {
      jsonString = JSON.stringify(this.rawJson);
    } catch (e) {
      console.log(e);
    }
    db.executeSql(
      `INSERT OR REPLACE INTO ${ChannelList.getTableName()} (
        id,
        channel_picture,
        name,
        description,
        unread_count,
        channel_type,
        last_updated_at,
        created_at,
        raw_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        this.id,
        this.channelPicture,
        this.name,
        this.description,
        this.unreadCount,
        this.channelType,
        this.lastUpdatedAt,
        this.createdAt,
        jsonString
      ]
    );
  }

  static async getAll(db: SQLiteDatabase): Promise<ChannelList[]> {
    const [results] = await db.executeSql(
      `SELECT * FROM ${ChannelList.getTableName()} ORDER BY last_updated_at DESC`
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
      createdAt: json.created_at,
      rawJson: json
    });
  }

  static fromDatabaseObject(json): ChannelList {
    let jsonParsed = null;
    try {
      jsonParsed = JSON.parse(json.raw_json);
    } catch (e) {
      console.log(e);
    }
    return new ChannelList({
      id: json.id,
      channelPicture: json.channel_picture,
      name: json.name,
      description: json.description,
      unreadCount: json.unread_count,
      channelType: json.channel_type,
      lastUpdatedAt: json.last_updated_at,
      createdAt: json.created_at,
      rawJson: jsonParsed
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
      createdAt: object?.time,
      rawJson: json
    });
  }
}

export default ChannelList;
