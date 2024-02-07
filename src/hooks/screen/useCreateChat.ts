import React from 'react';
import SimpleToast from 'react-native-simple-toast';

import ChannelList from '../../database/schema/ChannelListSchema';
import SignedMessageRepo from '../../service/repo/signedMessageRepo';
import UserSchema from '../../database/schema/UserSchema';
import useLocalDatabaseHook from '../../database/hooks/useLocalDatabaseHook';
import useChatUtilsHook, {AllowedGoToChatScreen} from '../core/chat/useChatUtilsHook';
import {GROUP_INFO} from '../core/constant';
import {getOrCreateAnonymousChannel} from '../../service/chat';

const useCreateChat = () => {
  const [loadingCreateChat, setLoadingCreateChat] = React.useState(false);
  const {localDb} = useLocalDatabaseHook();
  const {goToChatScreen} = useChatUtilsHook();

  const handleMemberSchema = (response) => {
    try {
      const members = response?.better_channel_member || response?.members;
      members.forEach(async (member) => {
        const userMember = UserSchema.fromMessageAnonymouslyAPI(member, response?.channel?.id);
        await userMember.saveOrUpdateIfExists(localDb);
      });
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

      console.log('initChannel', JSON.stringify(initChannel));
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

  const createAnonymousChat = async (selectedUser) => {
    try {
      setLoadingCreateChat(true);
      const response = await getOrCreateAnonymousChannel(selectedUser?.user?.userId);
      const chatData = createChannelJson(response, selectedUser);
      const channelList = ChannelList.fromMessageAnonymouslyAPI(chatData);
      await channelList.saveIfLatest(localDb);
      handleMemberSchema(response);
      goToChatScreen(channelList, GROUP_INFO);
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
      await channelList.saveIfLatest(localDb);
      handleMemberSchema(response);
      goToChatScreen(channelList, GROUP_INFO);
    } catch (e) {
      SimpleToast.show(e || 'Failed to message this user anonymously');
    }
  };

  return {
    createSignChat,
    createAnonymousChat,
    handleAnonymousMessage,
    loadingCreateChat
  };
};

export default useCreateChat;
