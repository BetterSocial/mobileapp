import React from 'react';
import SimpleToast from 'react-native-simple-toast';
import {v4 as uuid} from 'uuid';

import ChannelList from '../../database/schema/ChannelListSchema';
import ChannelListMemberSchema from '../../database/schema/ChannelListMemberSchema';
import SignedMessageRepo from '../../service/repo/signedMessageRepo';
import UserSchema from '../../database/schema/UserSchema';
import useLocalDatabaseHook from '../../database/hooks/useLocalDatabaseHook';
import useUserAuthHook from '../core/auth/useUserAuthHook';
import useChatUtilsHook, {AllowedGoToChatScreen} from '../core/chat/useChatUtilsHook';
import {AnonUserInfoTs} from '../../../types/core/AnonUserInfoTs.types';
import {GROUP_INFO} from '../core/constant';
import {MessageAnonymouslyData} from '../../../types/repo/AnonymousMessageRepo/MessageAnonymouslyData';
import {getChannelListInfo} from '../../utils/string/StringUtils';
import {getOrCreateAnonymousChannel} from '../../service/chat';

const useCreateChat = () => {
  const [loadingCreateChat, setLoadingCreateChat] = React.useState(false);
  const {localDb} = useLocalDatabaseHook();
  const {goToChatScreen} = useChatUtilsHook();
  const {signedProfileId, anonProfileId} = useUserAuthHook();

  const handleMemberSchema = (response) => {
    try {
      const builtChannelData = {
        better_channel_member: response?.better_channel_member,
        members: response?.members
      };

      const {originalMembers} = getChannelListInfo(
        builtChannelData,
        signedProfileId,
        anonProfileId
      );
      const members = originalMembers || response?.members;

      members?.forEach(async (member) => {
        const userMember = UserSchema.fromMemberWebsocketObject(member, response?.channel?.id);
        await userMember.saveOrUpdateIfExists(localDb);

        const memberSchema = ChannelListMemberSchema.fromWebsocketObject(
          response?.channel?.id,
          uuid(),
          member
        );
        await memberSchema.save(localDb);
      });
    } catch (e) {
      console.log(e, 'error on memberSchema');
    }
  };
  const createChannelJson = (response, selectedUser, isAnonymous = false) => {
    const channelWithMember = {...response.channel, members: response.members};
    let targetName =
      selectedUser?.user?.username || selectedUser?.user?.name || selectedUser.username;
    let targetImage =
      selectedUser?.user?.profilePicture ||
      selectedUser?.user?.image ||
      selectedUser.profilePicture;

    const targetRawJson = {
      type: 'notification.message_new',
      cid: response?.channel?.id,
      channel_id: '',
      channel_type: 'messaging',
      channel: channelWithMember,
      created_at: response?.channel,
      targetName,
      targetImage
    };

    let defaultAnonUserInfo: AnonUserInfoTs = {
      anon_user_info_color_code: '',
      anon_user_info_color_name: '',
      anon_user_info_emoji_code: '',
      anon_user_info_emoji_name: ''
    };

    if (isAnonymous) {
      const {
        anonUserInfoColorCode,
        anonUserInfoColorName,
        anonUserInfoEmojiCode,
        anonUserInfoEmojiName,
        channelImage,
        channelName
      } = getChannelListInfo(response?.channel, signedProfileId, anonProfileId);
      defaultAnonUserInfo = {
        anon_user_info_color_code: anonUserInfoColorCode,
        anon_user_info_color_name: anonUserInfoColorName,
        anon_user_info_emoji_code: anonUserInfoEmojiCode,
        anon_user_info_emoji_name: anonUserInfoEmojiName
      };

      targetName = channelName;
      targetImage = channelImage;
    }

    const chatData: MessageAnonymouslyData = {
      channel: response?.channel,
      members: response?.members,
      ...defaultAnonUserInfo,
      appAdditionalData: {
        rawJson: targetRawJson,
        message: '',
        targetName,
        targetImage
      }
    };
    return chatData;
  };

  const createSignChat = async (members: string[], selectedUser, from: AllowedGoToChatScreen) => {
    try {
      setLoadingCreateChat(true);
      const initChannel = await SignedMessageRepo.createSignedChat(members);
      const chatData = createChannelJson(initChannel, selectedUser);

      const channelList = ChannelList.fromMessageSignedAPI(chatData);
      channelList.saveIfLatest(localDb);
      handleMemberSchema(initChannel);
      setLoadingCreateChat(false);
      goToChatScreen(channelList, from);
    } catch (e) {
      setLoadingCreateChat(false);
      console.log({e}, 'error create chat');
    }
  };

  const handleAnonymousMessage = async (selectedUser, channelId = null, context = null) => {
    if (!selectedUser?.allow_anon_dm) {
      SimpleToast.show('This user does not allow anonymous messages');
      return;
    }

    try {
      const response = await getOrCreateAnonymousChannel(
        selectedUser?.user_id || selectedUser.userId,
        channelId,
        context
      );

      const chatData = createChannelJson(response, selectedUser, true);
      const channelList = ChannelList.fromMessageAnonymouslyAPI(chatData);
      await channelList.save(localDb);
      handleMemberSchema(response);
      goToChatScreen(channelList, GROUP_INFO);
    } catch (e) {
      SimpleToast.show(e || 'Failed to message this user anonymously');
    }
  };

  return {
    createSignChat,
    handleAnonymousMessage,
    loadingCreateChat
  };
};

export default useCreateChat;
