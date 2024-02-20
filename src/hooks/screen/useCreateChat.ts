import React from 'react';
import SimpleToast from 'react-native-simple-toast';

import ChannelList from '../../database/schema/ChannelListSchema';
import SignedMessageRepo from '../../service/repo/signedMessageRepo';
import UserSchema from '../../database/schema/UserSchema';
import useLocalDatabaseHook from '../../database/hooks/useLocalDatabaseHook';
import useUserAuthHook from '../core/auth/useUserAuthHook';
import useChatUtilsHook, {AllowedGoToChatScreen} from '../core/chat/useChatUtilsHook';
import {ChannelList as ChannelListObject} from '../../../types/database/schema/ChannelList.types';
import {GROUP_INFO} from '../core/constant';
import {getChannelListInfo} from '../../utils/string/StringUtils';
import {getOrCreateAnonymousChannel} from '../../service/chat';

const useCreateChat = () => {
  const [loadingCreateChat, setLoadingCreateChat] = React.useState(false);
  const {localDb} = useLocalDatabaseHook();
  const {goToChatScreen} = useChatUtilsHook();
  const {signedProfileId, anonProfileId} = useUserAuthHook();

  const handleMemberSchema = async (response) => {
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

      const promises: Promise<any>[] = [];

      members?.forEach(async (member) => {
        const userMember = UserSchema.fromMemberWebsocketObject(member, response?.channel?.id);
        await userMember.saveOrUpdateIfExists(localDb);
      });

      await Promise.all(promises);
    } catch (e) {
      console.log(e, 'error on memberSchema');
    }
  };
  const createChannelJson = (response, selectedUser) => {
    const channelWithMember = {...response.channel, members: response.members};
    const targetRawJson = {
      type: 'notification.message_new',
      cid: response?.channel?.id,
      channel_id: '',
      channel_type: 'messaging',
      channel: channelWithMember,
      created_at: response?.channel,
      targetName: selectedUser?.user?.username || selectedUser?.user?.name || selectedUser.username,
      targetImage:
        selectedUser?.user?.profilePicture ||
        selectedUser?.user?.image ||
        selectedUser.profilePicture
    };
    const chatData = {
      channel: response?.channel,
      members: response?.members,
      appAdditionalData: {
        rawJson: targetRawJson,
        message: '',
        targetName:
          selectedUser?.user?.username || selectedUser?.user?.name || selectedUser.username,
        targetImage:
          selectedUser?.user?.profilePicture ||
          selectedUser?.user?.image ||
          selectedUser.profilePicture
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

      await Promise.all([channelList.saveIfLatest(localDb), handleMemberSchema(initChannel)]);
      setLoadingCreateChat(false);
      goToChatScreen(channelList as ChannelListObject, from);
    } catch (e) {
      setLoadingCreateChat(false);
      console.log({e}, 'error create chat');
    }
  };

  const handleAnonymousMessage = async (selectedUser) => {
    if (!selectedUser?.allow_anon_dm) {
      SimpleToast.show('This user does not allow anonymous messages');
      return;
    }

    try {
      const response = await getOrCreateAnonymousChannel(
        selectedUser?.user_id || selectedUser.userId
      );
      const chatData = createChannelJson(response, selectedUser);
      const channelList = ChannelList.fromMessageAnonymouslyAPI(chatData);

      await Promise.all([channelList.save(localDb), handleMemberSchema(response)]);

      goToChatScreen(channelList as ChannelListObject, GROUP_INFO);
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
