import {v4 as uuid} from 'uuid';

import {
  InitAnonymousChatData,
  ModifyAnonymousChatData
} from '../../../types/repo/AnonymousMessageRepo/InitAnonymousChatData';
import useUserAuthHook from '../../hooks/core/auth/useUserAuthHook';
import useChatUtilsHook from '../../hooks/core/chat/useChatUtilsHook';
import {GROUP_INFO, SIGNED} from '../../hooks/core/constant';
import {getChannelListInfo} from '../../utils/string/StringUtils';
import ChannelListMemberSchema from '../schema/ChannelListMemberSchema';
import ChannelListSchema from '../schema/ChannelListSchema';
import ChatSchema from '../schema/ChatSchema';
import UserSchema from '../schema/UserSchema';
import useLocalDatabaseHook from './useLocalDatabaseHook';

const useSaveAnonChatHook = () => {
  const {localDb, refresh} = useLocalDatabaseHook();
  const {goToChatScreen} = useChatUtilsHook();
  const {signedProfileId, anonProfileId} = useUserAuthHook();

  const helperFindChatById = async (object: InitAnonymousChatData): Promise<ChannelListSchema> => {
    const channelId = object?.message?.cid?.replace('messaging:', '');
    const channelList = await ChannelListSchema.getById(localDb, channelId);

    const channelListSchema = ChannelListSchema.fromDatabaseObject(channelList);
    return channelListSchema;
  };

  const helperGoToAnonymousChat = async (object: InitAnonymousChatData, from: string) => {
    try {
      const channelListSchema = await helperFindChatById(object);
      goToChatScreen(channelListSchema, from);
    } catch (e) {
      console.log('error helperGoToAnonymousChat', e);
    }
  };

  const saveChatFromOtherProfile = async (
    object: InitAnonymousChatData,
    status = 'sent',
    withNavigate,
    type: string
  ) => {
    if (!localDb) return;
    const {channelName, channelImage, originalMembers} = getChannelListInfo(
      object,
      signedProfileId,
      anonProfileId
    );

    const initAnonymousChat: ModifyAnonymousChatData = {
      ...object,
      targetName: channelName,
      targetImage: channelImage
    };

    initAnonymousChat.message.cid = initAnonymousChat.message.cid.replace('messaging:', '');

    try {
      const chat = ChatSchema.fromInitAnonymousChatAPI(initAnonymousChat, status);
      await chat.save(localDb);
      const members = originalMembers || object?.members;
      members?.forEach((member) => {
        const saveUserAndChannelListMember = async () => {
          try {
            const userMember = UserSchema.fromInitAnonymousChatAPI(
              member,
              initAnonymousChat?.message?.cid
            );
            await userMember.saveOrUpdateIfExists(localDb);
          } catch (e) {
            console.log(e);
          }
          try {
            const memberSchema = ChannelListMemberSchema.fromInitAnonymousChatAPI(
              initAnonymousChat?.message?.cid,
              uuid(),
              member
            );
            await memberSchema.saveIfNotExist(localDb);
          } catch (e) {
            console.log(e);
          }
        };

        Promise.all([saveUserAndChannelListMember()]);
      });
    } catch (e) {
      console.log(e);
    }
    try {
      const channelListData = ChannelListSchema.fromInitAnonymousChatAPI(
        {
          ...initAnonymousChat
        },
        type === SIGNED ? 'PM' : 'ANON_PM'
      );
      await channelListData.saveIfLatest(localDb);
    } catch (e) {
      console.log(e);
    } finally {
      refresh('channelList');
      refresh('chat');
      if (withNavigate) {
        helperGoToAnonymousChat(object, GROUP_INFO);
      }
    }
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
    helperUpdateChannelListDescription(object).catch((e) =>
      console.log('error savePendingChatFromOtherProfile helperUpdateChannelListDescription', e)
    );
    saveChatFromOtherProfile(object, 'pending', withNavigate).catch((e) =>
      console.log('error savePendingChatFromOtherProfile saveChatFromOtherProfile', e)
    );
  };

  return {
    saveChatFromOtherProfile,
    savePendingChatFromOtherProfile
  };
};

export default useSaveAnonChatHook;
