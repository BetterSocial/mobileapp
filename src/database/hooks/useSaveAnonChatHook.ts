import React from 'react';
import {v4 as uuid} from 'uuid';

import ChannelListSchema from '../schema/ChannelListSchema';
import ChatSchema from '../schema/ChatSchema';
import UserSchema from '../schema/UserSchema';
import useChatUtilsHook from '../../hooks/core/chat/useChatUtilsHook';
import useLocalDatabaseHook from './useLocalDatabaseHook';
import useUserAuthHook from '../../hooks/core/auth/useUserAuthHook';
import {ANON_PM, GROUP_INFO, SIGNED} from '../../hooks/core/constant';
import {AnonUserInfo} from '../../../types/service/AnonProfile.type';
import {ChannelList} from '../../../types/database/schema/ChannelList.types';
import {
  InitAnonymousChatData,
  ModifyAnonymousChatData
} from '../../../types/repo/AnonymousMessageRepo/InitAnonymousChatData';
import {getChannelListInfo} from '../../utils/string/StringUtils';
import {sendAnonymousDMOtherProfile, sendSignedDMOtherProfile} from '../../service/chat';

const CHANNEL_BLOCKED = 'Channel is blocked';

const useSaveAnonChatHook = (eventTrack: any) => {
  const {localDb, refresh, refreshWithId} = useLocalDatabaseHook();
  const {goToChatScreen} = useChatUtilsHook();
  const {signedProfileId, anonProfileId} = useUserAuthHook();

  const [isLoadingSendDm, setIsLoadingSendDm] = React.useState(false);

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

  const sendChatFromOtherProfileV2 = async (params: SendChatFromOtherProfileParams) => {
    const {
      isAnonymous,
      targetUserId,
      message,
      anonUserInfo,
      channelIdAsSignedUser,
      channelIdAsAnonUser
    } = params;

    if (!targetUserId || !message) throw new Error('sendChatFromOtherProfile params is invalid');

    // Get channel based on channel id from other profile response
    let checkedChannel: ChannelListSchema | null = null;
    if (isAnonymous && channelIdAsAnonUser) {
      checkedChannel = await ChannelListSchema.getById(localDb, channelIdAsAnonUser);
    } else if (!isAnonymous && channelIdAsSignedUser) {
      checkedChannel = await ChannelListSchema.getById(localDb, channelIdAsSignedUser);
    }

    const randomMessageId = uuid();

    // If channel is found, save chat as pending, then navigate to chat screen
    let currentChatSchema: ChatSchema | null = null;
    if (checkedChannel) {
      currentChatSchema = await ChatSchema.generateSendingChat(
        randomMessageId,
        (isAnonymous ? anonProfileId : signedProfileId) || '',
        checkedChannel?.id,
        message,
        [],
        localDb,
        'regular',
        'pending'
      );

      await currentChatSchema?.save(localDb);

      helperGoToAnonymousChat(
        {
          message: {
            cid: checkedChannel?.id
          }
        },
        GROUP_INFO
      );
    }

    if (!checkedChannel) setIsLoadingSendDm(true);
    if (isAnonymous) {
      try {
        const response = await sendAnonymousDMOtherProfile({
          anon_user_info_emoji_name: anonUserInfo?.anon_user_info_emoji_name,
          anon_user_info_emoji_code: anonUserInfo?.anon_user_info_emoji_code,
          anon_user_info_color_name: anonUserInfo?.anon_user_info_color_name,
          anon_user_info_color_code: anonUserInfo?.anon_user_info_color_code,
          message,
          user_id: targetUserId
        });
        eventTrack?.onBioSendDm();
        if (checkedChannel) currentChatSchema?.updateChatSentStatus(localDb, response);
        else await saveChatFromOtherProfile(response, 'sent', !checkedChannel, ANON_PM);
      } catch (e) {
        console.log('error send anon dm', e);
        if (e?.response?.data?.status === CHANNEL_BLOCKED) {
          const response = e?.response?.data?.data;
          await savePendingChatFromOtherProfile(response, !checkedChannel, ANON_PM);
        }
      }
    } else {
      try {
        const response = await sendSignedDMOtherProfile({
          message,
          user_id: targetUserId
        });

        eventTrack?.onBioSendDm();

        const newResponse = {...response, members: response?.message?.members};
        if (checkedChannel) currentChatSchema?.updateChatSentStatus(localDb, response);
        else await saveChatFromOtherProfile(newResponse, 'sent', !checkedChannel, SIGNED);
      } catch (e) {
        console.log('error send signed dm', e);
      }
    }
    setIsLoadingSendDm(false);
  };

  return {
    isLoadingSendDm,

    saveChatFromOtherProfile,
    savePendingChatFromOtherProfile,
    sendChatFromOtherProfileV2,
    setIsLoadingSendDm
  };
};

export default useSaveAnonChatHook;
export type SendChatFromOtherProfileParams = {
  isAnonymous: boolean;
  targetUserId: string;
  message: string;
  anonUserInfo?: AnonUserInfo;
  channelIdAsSignedUser?: string;
  channelIdAsAnonUser?: string;
};
