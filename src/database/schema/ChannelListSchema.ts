import {SQLiteDatabase} from 'react-native-sqlite-storage';

import BaseDbSchema from './BaseDbSchema';
import ChannelListMemberSchema from './ChannelListMemberSchema';
import UserSchema from './UserSchema';
import {AnonymousChannelData} from '../../../types/repo/AnonymousMessageRepo/AnonymousChannelsData';
import {AnonymousPostNotification} from '../../../types/repo/AnonymousMessageRepo/AnonymousPostNotificationData';
import {
  InitAnonymousChatData,
  ModifyAnonymousChatData
} from '../../../types/repo/AnonymousMessageRepo/InitAnonymousChatData';

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

  expiredAt: string;

  rawJson: any;

  user: UserSchema | null;

  members: ChannelListMemberSchema[] | null;

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
    user,
    expiredAt = null,
    members = []
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
    this.members = members;
    this.expiredAt = expiredAt;
  }

  getAll = (db: any): Promise<BaseDbSchema[]> => {
    throw new Error('Method not implemented.');
  };

  static getById = async (db: any, id: string): Promise<ChannelList> => {
    const selectQuery = `SELECT * FROM ${ChannelList.getTableName()} WHERE id = ? LIMIT 1`;
    const selectParams = [id];

    const [results] = await db.executeSql(selectQuery, selectParams);
    if (results.rows.length === 0) return null;
    return results.rows.raw()[0];
  };

  static getChannelInfo = async (
    db: SQLiteDatabase,
    channelId: string,
    myId: string,
    myAnonymousId: string
  ): Promise<ChannelList> => {
    const channel = await this.getById(db, channelId);
    const members = await ChannelListMemberSchema.getAll(db, channelId, myId, myAnonymousId);
    channel.members = members;

    return ChannelList.fromDatabaseObject(channel);
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
          expired_at,
          raw_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
          this.expiredAt,
          jsonString
        ]
      );
    } catch (e) {
      console.log(e);
    }
  }

  async saveAndUpdateIncrementCount(db: SQLiteDatabase, incrementCount: number): Promise<void> {
    const unreadCountResponse = await db.executeSql(
      `SELECT unread_count FROM ${ChannelList.getTableName()} WHERE id = ?`,
      [this.id]
    );

    const unreadCount = unreadCountResponse[0]?.rows?.raw()[0]?.unread_count ?? 0;
    const incrementUnreadCount = unreadCount + incrementCount;

    this.unreadCount = incrementUnreadCount;
    this.save(db);
  }

  async saveIfLatest(db: SQLiteDatabase): Promise<void> {
    try {
      const existingChannel = await ChannelList.getById(db, this.id);
      if (!existingChannel) {
        await this.save(db);
        return;
      }

      const existingLastUpdatedAt = new Date(existingChannel.lastUpdatedAt);
      const newLastUpdatedAt = new Date(this.lastUpdatedAt);

      if (newLastUpdatedAt > existingLastUpdatedAt) {
        await this.save(db);
      }
    } catch (e) {
      console.log('save if latest error');
      console.log(e);
    }
  }

  async setRead(db: SQLiteDatabase): Promise<void> {
    try {
      await db.executeSql(
        `UPDATE ${ChannelList.getTableName()} SET unread_count = 0 WHERE id = ?`,
        [this.id]
      );
    } catch (e) {
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
      LEFT JOIN ${UserSchema.getTableName()} B
      ON A.last_updated_by = B.user_id
      WHERE expired_at IS NULL OR datetime(expired_at) >= datetime('now')
      ORDER BY last_updated_at DESC`,
      [myId, myAnonymousId]
    );
    return results.rows.raw().map(ChannelList.fromDatabaseObject);
  }

  static async getUnreadCount(db: SQLiteDatabase): Promise<number> {
    try {
      const [results] = await db.executeSql(
        `SELECT SUM(unread_count) as unread_count FROM ${ChannelList.getTableName()}
        WHERE expired_at IS NULL OR datetime(expired_at) >= datetime('now')`
      );

      return Promise.resolve(results?.rows?.raw()[0]?.unread_count || 0);
    } catch (e) {
      console.log(e);
      return Promise.resolve(0);
    }
  }

  static getTableName(): string {
    return 'channel_lists';
  }

  static fromWebsocketObject(json): ChannelList {
    return new ChannelList({
      id: json?.channel?.id,
      channelPicture: json?.targetImage,
      name: json?.targetName,
      description: json?.message?.text || json?.message?.message,
      unreadCount: json?.unread_count,
      channelType: 'ANON_PM',
      lastUpdatedAt: json?.channel?.last_message_at,
      lastUpdatedBy: json?.message?.user?.id,
      createdAt: json?.channel?.created_at,
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
      members: json.members,
      expiredAt: json.expired_at,
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

  static fromAnonymousChannelAPI(data: AnonymousChannelData): ChannelList {
    return new ChannelList({
      id: data?.id,
      channelPicture: data?.targetImage,
      name: data?.targetName,
      description: data?.firstMessage?.text || data?.firstMessage?.message,
      unreadCount: 0,
      channelType: 'ANON_PM',
      lastUpdatedAt: data?.last_message_at,
      lastUpdatedBy: data?.firstMessage?.user?.id,
      createdAt: data?.created_at,
      rawJson: data,
      user: null,
      members: null
    });
  }

  static fromAnonymousPostNotificationAPI(data: AnonymousPostNotification): ChannelList {
    return new ChannelList({
      id: data?.activity_id,
      channelPicture: '',
      name: data?.titlePost,
      description: data?.titlePost,
      unreadCount: 0,
      channelType: 'ANON_POST_NOTIFICATION',
      lastUpdatedAt: data?.data?.updated_at,
      lastUpdatedBy: '',
      createdAt: new Date().toISOString(),
      rawJson: data,
      user: null,
      members: null,
      expiredAt: data?.expired_at
    });
  }

  static fromInitAnonymousChatAPI(data: ModifyAnonymousChatData): ChannelList {
    return new ChannelList({
      id: data?.message?.cid,
      channelPicture: '',
      name: data?.targetName,
      description: data?.message?.message,
      unreadCount: 0,
      channelType: 'ANON_PM',
      lastUpdatedAt: data?.message?.created_at,
      lastUpdatedBy: data?.message?.user?.id,
      createdAt: data?.message?.created_at,
      rawJson: data,
      user: null,
      expiredAt: null,
      members: null
    });
  }
}

export default ChannelList;
