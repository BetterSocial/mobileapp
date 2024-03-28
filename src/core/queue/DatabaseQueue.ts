/* eslint-disable no-shadow */
import BaseQueue from './BaseQueue';

export enum DatabaseOperationLabel {
  CoreChatSystem_SaveFollowingMessage = 'core_chat_system_save_following_message',
  CoreChatSystem_GeneralSystemMessage = 'core_chat_system_general_system_message',
  CoreChatSystem_SaveChat = 'core_chat_system_save_chat',
  CoreChatSystem_SaveUserMember = 'core_chat_system_save_user_member',

  FetchChannelDetail_SaveAllChat = 'channel_detail_save_all_chat',
  FetchChannelDetail_RefreshChannelList = 'channel_detail_refresh_channel_list',
  FetchChannelDetail_SaveChannelList = 'channel_detail_save_channel_list',
  FetchChannelDetail_SaveUserMember = 'channel_detail_save_user_member',

  ChatScreen_GetChat = 'chat_screen_get_chat',
  ChatScreen_GetSelfAnonUserInfo = 'chat_screen_get_self_anon_user_info',
  ChatScreen_SendChat = 'chat_screen_send_chat',
  ChatScreen_UpdateChannelDescription = 'chat_screen_update_channel_description',
  ChatScreen_UpdateChatSentStatus = 'chat_screen_update_chat_sent_status'
}

class DatabaseQueue extends BaseQueue {
  static dbInstance: DatabaseQueue;

  static getInstance(): DatabaseQueue {
    if (!this.dbInstance) {
      return new DatabaseQueue();
    }

    return this.dbInstance;
  }
}

export default DatabaseQueue;
