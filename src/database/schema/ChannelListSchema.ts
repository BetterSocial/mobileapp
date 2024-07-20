/* eslint-disable class-methods-use-this */
import {SQLiteDatabase} from 'react-native-sqlite-storage';

import BaseDbSchema from './BaseDbSchema';
import ChannelListMemberSchema from './ChannelListMemberSchema';
import UserSchema from './UserSchema';
import {AnonUserInfo} from '../../../types/service/AnonProfile.type';
import {AnonymousPostNotification} from '../../../types/repo/AnonymousMessageRepo/AnonymousPostNotificationData';
import {
  BetterSocialChannelType,
  ChannelFirstMessage
} from '../../../types/database/schema/ChannelList.types';
import {CHANNEL_GROUP, PM} from '../../hooks/core/constant';
import {ChannelData} from '../../../types/repo/AnonymousMessageRepo/AnonymousChannelsData';
import {ChannelType} from '../../../types/repo/ChannelData';
import {DEFAULT_PROFILE_PIC_PATH} from '../../utils/constants';
import {MessageAnonymouslyData} from '../../../types/repo/AnonymousMessageRepo/MessageAnonymouslyData';
import {ModifyAnonymousChatData} from '../../../types/repo/AnonymousMessageRepo/InitAnonymousChatData';
import {SignedPostNotification} from '../../../types/repo/SignedMessageRepo/SignedPostNotificationData';

class ChannelList implements BaseDbSchema {
  id: string;

  channelPicture: string;

  name: string;

  description: string;

  unreadCount: number;

  channelType: BetterSocialChannelType;

  lastUpdatedAt: string;

  lastUpdatedBy: string;

  createdAt: string;

  expiredAt: string | null;

  rawJson: any;

  topicPostExpiredAt: string | null;

  user: UserSchema | null;

  members: ChannelListMemberSchema[] | null | undefined;

  memberUsers: UserSchema[] | null | undefined;

  anon_user_info_color_code: string | null;

  anon_user_info_color_name: string | null;

  anon_user_info_emoji_name: string | null;

  anon_user_info_emoji_code: string | null;

  firstMessage: ChannelFirstMessage | null;

  isLastUpdatedByMe: boolean | undefined;

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
    topicPostExpiredAt,
    user,
    expiredAt = null,
    members = [],
    memberUsers = [],
    anon_user_info_color_code = null,
    anon_user_info_color_name = null,
    anon_user_info_emoji_name = null,
    anon_user_info_emoji_code = null,
    firstMessage = null,
    isLastUpdatedByMe = null
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
    this.topicPostExpiredAt = topicPostExpiredAt;
    this.user = user;
    this.members = members;
    this.expiredAt = expiredAt;
    this.anon_user_info_color_code = anon_user_info_color_code;
    this.anon_user_info_color_name = anon_user_info_color_name;
    this.anon_user_info_emoji_name = anon_user_info_emoji_name;
    this.anon_user_info_emoji_code = anon_user_info_emoji_code;
    this.memberUsers = memberUsers;
    this.firstMessage = firstMessage;
    this.isLastUpdatedByMe = isLastUpdatedByMe;
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

  static getSchemaById = async (db: any, id: string): Promise<ChannelList | null> => {
    const channelListDb = await ChannelList.getById(db, id);
    if (!channelListDb) return null;
    return this.fromDatabaseObject(channelListDb);
  };

  static getChannelInfo = async (
    db: SQLiteDatabase,
    channelId: string,
    myId: string,
    myAnonymousId: string
  ): Promise<ChannelList> => {
    const channel = await this.getById(db, channelId);
    const memberUsers = await UserSchema.getAllByChannelId(db, channelId, myId, myAnonymousId);
    channel.memberUsers = memberUsers;

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
          topic_post_expired_at,
          raw_json,
          anon_user_info_color_code,
          anon_user_info_color_name,
          anon_user_info_emoji_name,
          anon_user_info_emoji_code
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          this.id,
          this.channelPicture,
          this.name,
          this.description,
          this.unreadCount,
          this.channelType,
          this.lastUpdatedAt,
          this.lastUpdatedBy ?? null,
          this.createdAt ?? new Date(),
          this.expiredAt ?? null,
          this.topicPostExpiredAt ?? null,
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
        B.is_banned,
        C.message,
        C.type,
        C.attachment_json as chat_attachment_json
      FROM ${ChannelList.getTableName()} A
      LEFT JOIN ${UserSchema.getTableName()} B
      ON A.last_updated_by = B.user_id AND A.id = B.channel_id
      LEFT JOIN 
        (SELECT DISTINCT(chats.channel_id), chats.* FROM chats ORDER BY chats.updated_at DESC LIMIT 1) as C
      ON A.id = C.channel_id
      WHERE expired_at IS NULL OR datetime(expired_at) >= datetime('now') AND A.description != ''
      AND A.channel_type NOT IN ('ANON_PM', 'ANON_POST_NOTIFICATION', 'ANON_GROUP')
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
        B.is_banned,
        A.anon_user_info_color_code,
        A.anon_user_info_color_name,
        A.anon_user_info_emoji_name,
        A.anon_user_info_emoji_code
      FROM ${ChannelList.getTableName()} A
      LEFT JOIN ${UserSchema.getTableName()} B
      ON A.last_updated_by = B.user_id AND A.id = B.channel_id
      WHERE (expired_at IS NULL OR datetime(expired_at) >= datetime('now')) AND A.description != ''
      AND A.channel_type IN ('ANON_PM', 'ANON_POST_NOTIFICATION', 'ANON_GROUP', 'ANON_TOPIC')
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

  static async getAllUnreadCount(db: SQLiteDatabase): Promise<number> {
    try {
      const selectQuery = `SELECT SUM(unread_count) as unread_count
        FROM ${ChannelList.getTableName()}
        WHERE expired_at IS NULL
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
    isUpdateTimestamp = false,
    topicPostExpiredAt: string | null = null
  ) => {
    let rawJson: string | null = null;

    try {
      rawJson = JSON.stringify(json);
    } catch (e) {
      console.log('error stringify:', e);
    }

    try {
      const queryTimestamp = `UPDATE ${ChannelList.getTableName()}
        SET description = ?, created_at = ?, last_updated_at = ?, raw_json = ?, topic_post_expired_at = ?
        WHERE id = ?;`;
      const queryWithoutTimestamp = `UPDATE ${ChannelList.getTableName()}
        SET description = ?, raw_json = ?, topic_post_expired_at = ?
        WHERE id = ?;`;

      const replacementTimestamp = [
        description,
        new Date().toISOString(),
        new Date().toISOString(),
        rawJson,
        topicPostExpiredAt,
        channelId
      ];
      const replacementWithoutTimestamp = [description, rawJson, topicPostExpiredAt, channelId];

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
      topicPostExpiredAt: json?.message?.post_expired_at,
      rawJson: json,
      user: null,
      anon_user_info_color_code: json?.anon_user_info_color_code,
      anon_user_info_color_name: json?.anon_user_info_color_name,
      anon_user_info_emoji_name: json?.anon_user_info_emoji_name,
      anon_user_info_emoji_code: json?.anon_user_info_emoji_code
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
      memberUsers: json.memberUsers,
      expiredAt: json.expired_at,
      topicPostExpiredAt: json.topic_post_expired_at,
      user,
      anon_user_info_color_code: json?.anon_user_info_color_code,
      anon_user_info_color_name: json?.anon_user_info_color_name,
      anon_user_info_emoji_name: json?.anon_user_info_emoji_name,
      anon_user_info_emoji_code: json?.anon_user_info_emoji_code,
      isLastUpdatedByMe: json?.is_me,
      firstMessage: {
        message: json?.message || null,
        type: json?.type,
        attachmentJson: json?.chat_attachment_json
      }
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
      user: null,
      topicPostExpiredAt: null
    });
  }

  static fromChannelAPI(
    data: ChannelData,
    channelType: ChannelType,
    members?: ChannelData['members'],
    anonUserInfo: AnonUserInfo | null = null
  ): ChannelList {
    const isPM = channelType === 'PM';
    const firstMessage = data?.messages[0] || data?.firstMessage;
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
      lastUpdatedAt: data?.last_message_at || data?.updated_at,
      lastUpdatedBy: firstMessage?.user?.id || data?.created_by?.id,
      createdAt: data?.created_at || data?.channel?.created_at,
      topicPostExpiredAt: data?.topicPostExpiredAt,
      rawJson: data,
      user: null,
      members: members || null,
      anon_user_info_color_code: anonUserInfo?.anon_user_info_color_code ?? null,
      anon_user_info_color_name: anonUserInfo?.anon_user_info_color_name ?? null,
      anon_user_info_emoji_name: anonUserInfo?.anon_user_info_emoji_name ?? null,
      anon_user_info_emoji_code: anonUserInfo?.anon_user_info_emoji_code ?? null
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
      anon_user_info_color_code: data?.postMaker?.data?.color_code,
      anon_user_info_color_name: data?.postMaker?.data?.color_name,
      anon_user_info_emoji_name: data?.postMaker?.data?.emoji_name,
      anon_user_info_emoji_code: data?.postMaker?.data?.emoji_code,
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
      anon_user_info_color_code: data?.postMaker?.data?.color_code,
      anon_user_info_color_name: data?.postMaker?.data?.color_name,
      anon_user_info_emoji_name: data?.postMaker?.data?.emoji_name,
      anon_user_info_emoji_code: data?.postMaker?.data?.emoji_code,
      members: null,
      expiredAt: data?.expired_at
    });
  }

  static fromInitAnonymousChatAPI(
    data: ModifyAnonymousChatData,
    type: 'ANON_PM' | 'PM'
  ): ChannelList {
    return new ChannelList({
      id: data?.message?.cid,
      channelPicture: data?.targetImage || DEFAULT_PROFILE_PIC_PATH,
      name: data?.targetName,
      description: data?.message?.message,
      unreadCount: 0,
      channelType: type,
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
      members: null,
      anon_user_info_color_code: data?.anon_user_info_color_code,
      anon_user_info_color_name: data?.anon_user_info_color_name,
      anon_user_info_emoji_name: data?.anon_user_info_emoji_name,
      anon_user_info_emoji_code: data?.anon_user_info_emoji_code
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
      lastUpdatedAt: data?.channel?.last_message_at || data?.channel?.updated_at,
      lastUpdatedBy: '',
      createdAt: data?.channel?.created_at,
      rawJson: data?.appAdditionalData?.rawJson,
      user: null,
      expiredAt: null,
      members: null,
      anon_user_info_color_code: data?.anon_user_info_color_code,
      anon_user_info_color_name: data?.anon_user_info_color_name,
      anon_user_info_emoji_name: data?.anon_user_info_emoji_name,
      anon_user_info_emoji_code: data?.anon_user_info_emoji_code
    });
  }
}

export default ChannelList;
