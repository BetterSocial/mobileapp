import {v4 as uuid} from 'uuid';

import ChannelListSchema from '../schema/ChannelListSchema';
import ChatSchema from '../schema/ChatSchema';
import UserSchema from '../schema/UserSchema';
import useChatUtilsHook from '../../hooks/core/chat/useChatUtilsHook';
import useLocalDatabaseHook from './useLocalDatabaseHook';
import useUserAuthHook from '../../hooks/core/auth/useUserAuthHook';
import {ChannelList} from '../../../types/database/schema/ChannelList.types';
import {GROUP_INFO, SIGNED} from '../../hooks/core/constant';
import {
  InitAnonymousChatData,
  ModifyAnonymousChatData
} from '../../../types/repo/AnonymousMessageRepo/InitAnonymousChatData';
import {getChannelListInfo} from '../../utils/string/StringUtils';

const useSaveAnonChatHook = () => {
  const {localDb, refresh, refreshWithId} = useLocalDatabaseHook();
  const {goToChatScreen} = useChatUtilsHook();
  const {signedProfileId, anonProfileId} = useUserAuthHook();

  const helperFindChatById = async (
    object: InitAnonymousChatData
  ): Promise<ChannelListSchema | null> => {
    const channelId = object?.message?.cid?.replace('messaging:', '');
    const channelList = await ChannelListSchema.getById(localDb, channelId);

    const channelListSchema = ChannelListSchema.fromDatabaseObject(channelList);
    return channelListSchema;
  };

  const saveUserAndChannelListMember = async (channelId, member) => {
    try {
      const userMember = UserSchema.fromInitAnonymousChatAPI(member, channelId);
      await userMember.saveOrUpdateIfExists(localDb);
    } catch (e) {
      console.log('error saveUserAndChannelListMember', e);
    }
  };

  const helperGoToAnonymousChat = async (object: InitAnonymousChatData, from: string) => {
    try {
      const channelListSchema = await helperFindChatById(object);
      goToChatScreen(channelListSchema as ChannelList, from);
    } catch (e) {
      console.log('error helperGoToAnonymousChat', e);
    }
  };

  const helperSaveChannel = async (object: ModifyAnonymousChatData, type: string) => {
    const channelId = object?.message?.cid?.replace('messaging:', '');
    let channelList = await ChannelListSchema.getById(localDb, channelId);

    if (!channelList) {
      channelList = ChannelListSchema.fromInitAnonymousChatAPI(
        object,
        type === SIGNED ? 'PM' : 'ANON_PM'
      );
    }

    channelList.description = object?.message?.text;
    channelList.lastUpdatedAt = new Date().toISOString();
    channelList.lastUpdatedBy = object?.message?.user?.id;
    await channelList.saveIfLatest(localDb);
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
      await helperSaveChannel(initAnonymousChat, type);
    } catch (e) {
      console.log(e);
    }

    try {
      const chat = ChatSchema.fromInitAnonymousChatAPI(initAnonymousChat, status);
      await chat.save(localDb);
      const members = originalMembers || object?.members;
      const promises: Promise<void>[] = members?.map((member) => {
        return saveUserAndChannelListMember(initAnonymousChat.message.cid, member);
      });

      await Promise.all(promises);
    } catch (e) {
      console.log(e);
    } finally {
      refresh('channelList');
      refreshWithId('chat', initAnonymousChat.message.cid);
      if (withNavigate) {
        helperGoToAnonymousChat(object, GROUP_INFO);
      }
    }
  };

  const savePendingChatFromOtherProfile = async (
    object: InitAnonymousChatData,
    withNavigate = false,
    type: string
  ) => {
    saveChatFromOtherProfile(object, 'pending', withNavigate, type).catch((e) =>
      console.log('error savePendingChatFromOtherProfile saveChatFromOtherProfile', e)
    );
  };

  return {
    saveChatFromOtherProfile,
    savePendingChatFromOtherProfile
  };
};

export default useSaveAnonChatHook;
