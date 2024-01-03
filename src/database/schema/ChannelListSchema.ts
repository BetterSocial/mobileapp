/* eslint-disable class-methods-use-this */
import {SQLiteDatabase} from 'react-native-sqlite-storage';

import BaseDbSchema from './BaseDbSchema';
import ChannelListMemberSchema from './ChannelListMemberSchema';
import UserSchema from './UserSchema';
import {AnonUserInfo} from '../../../types/service/AnonProfile.type';
import {AnonymousPostNotification} from '../../../types/repo/AnonymousMessageRepo/AnonymousPostNotificationData';
import {CHANNEL_GROUP, PM} from '../../hooks/core/constant';
import {ChannelData} from '../../../types/repo/AnonymousMessageRepo/AnonymousChannelsData';
import {ChannelType} from '../../../types/repo/ChannelData';
import {MessageAnonymouslyData} from '../../../types/repo/AnonymousMessageRepo/MessageAnonymouslyData';
import {ModifyAnonymousChatData} from '../../../types/repo/AnonymousMessageRepo/InitAnonymousChatData';
import {SignedPostNotification} from '../../../types/repo/SignedMessageRepo/SignedPostNotificationData';

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

  expiredAt: string | null;

  rawJson: any;

  user: UserSchema | null;

  members: ChannelListMemberSchema[] | null | undefined;

  anon_user_info_color_code: string | null;

  anon_user_info_color_name: string | null;

  anon_user_info_emoji_name: string | null;

  anon_user_info_emoji_code: string | null;

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
    members = [],
    anon_user_info_color_code = null,
    anon_user_info_color_name = null,
    anon_user_info_emoji_name = null,
    anon_user_info_emoji_code = null
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
    this.anon_user_info_color_code = anon_user_info_color_code;
    this.anon_user_info_color_name = anon_user_info_color_name;
    this.anon_user_info_emoji_name = anon_user_info_emoji_name;
    this.anon_user_info_emoji_code = anon_user_info_emoji_code;
  }

  saveIfNotExist(db: SQLiteDatabase): Promise<void> {
    throw new Error('Method not implemented.');
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
      await db.executeSql(
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
          raw_json,
          anon_user_info_color_code,
          anon_user_info_color_name,
          anon_user_info_emoji_name,
          anon_user_info_emoji_code
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
          jsonString,
          this.anon_user_info_color_code,
          this.anon_user_info_color_name,
          this.anon_user_info_emoji_name,
          this.anon_user_info_emoji_code
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

      const existingLastUpdatedAt = new Date(existingChannel.last_updated_at);
      const newLastUpdatedAt = new Date(this.lastUpdatedAt);

      if (newLastUpdatedAt.getTime() > existingLastUpdatedAt.getTime()) {
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
      `SELECT 
        A.*,
        CASE last_updated_by
          WHEN ? THEN 1
          WHEN ? THEN 1
          ELSE 0 END AS is_me,
        B.id AS user_row_id,
        B.user_id,
        B.channel_id,
        B.username,
        B.country_code,
        B.created_at AS user_created_at,
        B.updated_at AS user_updated_at,
        B.last_active_at,
        B.profile_picture,
        B.bio,
        B.is_banned
      FROM ${ChannelList.getTableName()} A
      LEFT JOIN ${UserSchema.getTableName()} B
      ON A.last_updated_by = B.user_id AND A.id = B.channel_id
      WHERE expired_at IS NULL OR datetime(expired_at) >= datetime('now') AND A.description != ''
      ORDER BY last_updated_at DESC`,
      [myId, myAnonymousId]
    );
    return results.rows.raw().map(ChannelList.fromDatabaseObject);
  }

  static async getAllAnonymousChannelList(
    db: SQLiteDatabase,
    myId: string,
    myAnonymousId: string
  ): Promise<ChannelList[]> {
    const [results] = await db.executeSql(
      `SELECT 
        A.*,
        CASE last_updated_by
          WHEN ? THEN 1
          WHEN ? THEN 1
          ELSE 0 END AS is_me,
        B.id AS user_row_id,
        B.user_id,
        B.channel_id,
        B.username,
        B.country_code,
        B.created_at AS user_created_at,
        B.updated_at AS user_updated_at,
        B.last_active_at,
        B.profile_picture,
        B.bio,
        B.is_banned
      FROM ${ChannelList.getTableName()} A
      LEFT JOIN ${UserSchema.getTableName()} B
      ON A.last_updated_by = B.user_id AND A.id = B.channel_id
      WHERE (expired_at IS NULL OR datetime(expired_at) >= datetime('now')) AND A.description != ''
      AND A.channel_type IN ('ANON_PM', 'ANON_POST_NOTIFICATION', 'ANON_GROUP')
      ORDER BY last_updated_at DESC`,
      [myId, myAnonymousId]
    );
    return results.rows.raw().map(ChannelList.fromDatabaseObject);
  }

  static async getUnreadCount(
    db: SQLiteDatabase,
    channelCategory: 'SIGNED' | 'ANON'
  ): Promise<number> {
    try {
      const signedQuery = "('PM', 'GROUP', 'TOPIC', 'POST_NOTIFICATION', 'FOLLOW')";
      const anonQuery = "('ANON_PM', 'ANON_GROUP', 'ANON_POST_NOTIFICATION')";

      const selectQuery = `SELECT SUM(unread_count) as unread_count
        FROM ${ChannelList.getTableName()}
        WHERE channel_type IN ${channelCategory === 'ANON' ? anonQuery : signedQuery}
        AND expired_at IS NULL
        OR datetime(expired_at) >= datetime('now')`;

      const [results] = await db.executeSql(selectQuery);

      return Promise.resolve(results?.rows?.raw()[0]?.unread_count || 0);
    } catch (e) {
      console.log(e);
      return Promise.resolve(0);
    }
  }

  static clearAll = async (db: SQLiteDatabase): Promise<void> => {
    const query = `DELETE FROM ${ChannelList.getTableName()}`;
    await db.executeSql(query);
  };

  static getTableName(): string {
    return 'channel_lists';
  }

  static updateChannelDescription = async (
    db: SQLiteDatabase,
    channelId: string,
    description: string,
    json,
    isUpdateTimestamp = false
  ) => {
    let rawJson: string | null = null;

    try {
      rawJson = JSON.stringify(json);
    } catch (e) {
      console.log('error stringify:', e);
    }

    try {
      const queryTimestamp = `UPDATE ${ChannelList.getTableName()}
        SET description = ?, created_at = ?, last_updated_at = ?, raw_json = ?
        WHERE id = ?;`;
      const queryWithoutTimestamp = `UPDATE ${ChannelList.getTableName()}
        SET description = ?, raw_json = ?
        WHERE id = ?;`;

      const replacementTimestamp = [
        description,
        new Date().toISOString(),
        new Date().toISOString(),
        rawJson,
        channelId
      ];
      const replacementWithoutTimestamp = [description, rawJson, channelId];

      if (isUpdateTimestamp) {
        await db.executeSql(queryTimestamp, replacementTimestamp);
      } else {
        await db.executeSql(queryWithoutTimestamp, replacementWithoutTimestamp);
      }
    } catch (e) {
      console.log('error updating channel description', e);
    }
  };

  static fromWebsocketObject(json, channelType: ChannelType): ChannelList {
    return new ChannelList({
      id: json?.channel?.id,
      channelPicture: json?.targetImage,
      name: json?.targetName,
      description: json?.message?.text || json?.message?.message,
      unreadCount: json?.unread_count,
      channelType,
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

  static fromPostNotifObject(
    json,
    channelType: 'POST_NOTIFICATION' | 'ANON_POST_NOTIFICATION'
  ): ChannelList {
    const object = json?.new[0];
    return new ChannelList({
      id: `${object?.id}${channelType === 'ANON_POST_NOTIFICATION' ? '_anon' : ''}'}`,
      channelPicture: '',
      name: '',
      description: object?.message,
      unreadCount: 1,
      channelType,
      lastUpdatedAt: object?.time,
      lastUpdatedBy: object?.actor?.id,
      createdAt: object?.time,
      rawJson: json,
      user: null
    });
  }

  static fromChannelAPI(
    data: ChannelData,
    channelType: ChannelType,
    members?: ChannelData['members'],
    anonUserInfo: AnonUserInfo | null = null
  ): ChannelList {
    const isPM = channelType === 'PM';
    const firstMessage = data?.firstMessage;
    const isSystemMessage = firstMessage?.type === 'system' || firstMessage?.isSystem;
    const isMe = firstMessage?.user?.id === data?.myUserId;
    let descriptionSystemMessage;

    if (isPM && isMe && isSystemMessage) descriptionSystemMessage = firstMessage?.textOwnMessage;

    return new ChannelList({
      id: data?.id,
      channelPicture: data?.targetImage,
      name: data?.targetName,
      description: descriptionSystemMessage || firstMessage?.text || firstMessage?.message || '',
      unreadCount: data?.unreadCount ?? 0,
      channelType,
      lastUpdatedAt: data?.last_message_at ?? data?.created_at,
      lastUpdatedBy: firstMessage?.user?.id,
      createdAt: data?.created_at,
      rawJson: data,
      user: null,
      anon_user_info_color_code: anonUserInfo?.anon_user_info_color_code ?? null,
      anon_user_info_color_name: anonUserInfo?.anon_user_info_color_name ?? null,
      anon_user_info_emoji_name: anonUserInfo?.anon_user_info_emoji_name ?? null,
      anon_user_info_emoji_code: anonUserInfo?.anon_user_info_emoji_code ?? null,
      members: members || null
    });
  }

  static fromSignedPostNotificationAPI(data: SignedPostNotification): ChannelList {
    return new ChannelList({
      id: data?.activity_id,
      channelPicture: data?.postMaker?.data?.profile_pic_url || '',
      name: data?.titlePost,
      description: data?.titlePost,
      unreadCount: data?.unreadCount ?? 0,
      channelType: 'POST_NOTIFICATION',
      lastUpdatedAt: data?.data?.updated_at,
      lastUpdatedBy: '',
      createdAt: new Date().toISOString(),
      rawJson: data,
      user: null,
      members: null,
      expiredAt: data?.expired_at
    });
  }

  static fromAnonymousPostNotificationAPI(data: AnonymousPostNotification): ChannelList {
    return new ChannelList({
      id: `${data?.activity_id}_anon`,
      channelPicture: data?.postMaker?.data?.profile_pic_url || '',
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

  static fromMessageAnonymouslyAPI(data: MessageAnonymouslyData): ChannelList {
    return new ChannelList({
      id: data?.channel?.id,
      channelPicture: data?.appAdditionalData?.targetImage,
      name: data?.appAdditionalData?.targetName,
      description: data?.appAdditionalData?.message,
      unreadCount: 0,
      channelType: 'ANON_PM',
      lastUpdatedAt: data?.channel?.last_message_at,
      lastUpdatedBy: '',
      createdAt: data?.channel?.created_at,
      rawJson: data?.appAdditionalData?.rawJson,
      user: null,
      expiredAt: null,
      members: null
    });
  }

  static fromMessageSignedAPI(data: MessageAnonymouslyData): ChannelList {
    const isGroup = data?.members?.length > 2;
    return new ChannelList({
      id: data?.channel?.id,
      channelPicture: isGroup ? null : data?.appAdditionalData?.targetImage,
      name: data?.appAdditionalData?.targetName,
      description: data?.appAdditionalData?.message,
      unreadCount: 0,
      channelType: isGroup ? CHANNEL_GROUP : PM,
      lastUpdatedAt: data?.channel?.last_message_at,
      lastUpdatedBy: '',
      createdAt: data?.channel?.created_at,
      rawJson: data?.appAdditionalData?.rawJson,
      user: null,
      expiredAt: null,
      members: null
    });
  }
}

export default ChannelList;
