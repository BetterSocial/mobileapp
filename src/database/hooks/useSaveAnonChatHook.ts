import {v4 as uuid} from 'uuid';

import ChannelListMemberSchema from '../schema/ChannelListMemberSchema';
import ChannelListSchema from '../schema/ChannelListSchema';
import ChatSchema from '../schema/ChatSchema';
import UserSchema from '../schema/UserSchema';
import useChatUtilsHook from '../../hooks/core/chat/useChatUtilsHook';
import useLocalDatabaseHook from './useLocalDatabaseHook';
import {
  InitAnonymousChatData,
  ModifyAnonymousChatData
} from '../../../types/repo/AnonymousMessageRepo/InitAnonymousChatData';
import {getAnonymousChatName} from '../../utils/string/StringUtils';

const useSaveAnonChatHook = () => {
  const {localDb, refresh} = useLocalDatabaseHook();
  const {goToChatScreen} = useChatUtilsHook();

  const helperFindChatById = async (object: InitAnonymousChatData): Promise<ChannelListSchema> => {
    const channelId = object?.message?.cid?.replace('messaging:', '');
    const channelList = await ChannelListSchema.getById(localDb, channelId);

    const channelListSchema = ChannelListSchema.fromDatabaseObject(channelList);
    return channelListSchema;
  };

  const helperGoToAnonymousChat = async (object: InitAnonymousChatData) => {
    const channelListSchema = await helperFindChatById(object);
    goToChatScreen(channelListSchema);
  };

  const saveChatFromOtherProfile = async (
    object: InitAnonymousChatData,
    status = 'sent',
    withNavigate = false
  ) => {
    if (!localDb) return;

    const chatName = await getAnonymousChatName(object?.members);
    const initAnonymousChat: ModifyAnonymousChatData = {
      ...object,
      targetName: chatName?.name,
      targetImage: chatName?.image
    };

    initAnonymousChat.message.cid = initAnonymousChat.message.cid.replace('messaging:', '');

    const chat = ChatSchema.fromInitAnonymousChatAPI(initAnonymousChat, status);
    await chat.save(localDb);

    try {
      object?.members?.forEach(async (member) => {
        try {
          const userMember = UserSchema.fromInitAnonymousChatAPI(
            member,
            initAnonymousChat?.message?.cid
          );
          await userMember.saveOrUpdateIfExists(localDb);
        } catch (e) {
          console.log('error saveChatFromOtherProfile userMember', e);
        }

        try {
          const memberSchema = ChannelListMemberSchema.fromInitAnonymousChatAPI(
            initAnonymousChat?.message?.cid,
            uuid(),
            member
          );

          memberSchema.saveIfNotExist(localDb);
        } catch (e) {
          console.log('error saveChatFromOtherProfile memberSchema', e);
        }
      });
    } catch (e) {
      console.log('error saveChatFromOtherProfile');
      console.log(e);
    }

    refresh('channelList');
    refresh('chat');

    if (withNavigate) helperGoToAnonymousChat(object);
  };

  const helperUpdateChannelListDescription = async (object: InitAnonymousChatData) => {
    const channelListSchema = await helperFindChatById(object);

    channelListSchema.description = object?.message?.text;
    channelListSchema.lastUpdatedAt = new Date().toISOString();
    channelListSchema.lastUpdatedBy = object?.message?.user?.id;
    channelListSchema.save(localDb);
  };

  const savePendingChatFromOtherProfile = async (
    object: InitAnonymousChatData,
    withNavigate = false
  ) => {
    try {
      helperUpdateChannelListDescription(object);
      saveChatFromOtherProfile(object, 'pending', withNavigate);
    } catch (e) {
      console.log('error savePendingChatFromOtherProfile', e);
    }
  };

  return {
    saveChatFromOtherProfile,
    savePendingChatFromOtherProfile
  };
};

export default useSaveAnonChatHook;
