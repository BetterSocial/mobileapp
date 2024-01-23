import React from 'react';
import SimpleToast from 'react-native-simple-toast';
import {v4 as uuid} from 'uuid';

import {getOrCreateAnonymousChannel} from '../../service/chat';
import SignedMessageRepo from '../../service/repo/signedMessageRepo';
import ChannelList from '../../database/schema/ChannelListSchema';
import useLocalDatabaseHook from '../../database/hooks/useLocalDatabaseHook';
import UserSchema from '../../database/schema/UserSchema';
import ChannelListMemberSchema from '../../database/schema/ChannelListMemberSchema';
import useChatUtilsHook from '../core/chat/useChatUtilsHook';
import {GROUP_INFO} from '../core/constant';

const useCreateChat = () => {
  const [loadingCreateChat, setLoadingCreateChat] = React.useState(false);
  const {localDb} = useLocalDatabaseHook();
  const {goToChatScreen} = useChatUtilsHook();

  const handleMemberSchema = (response) => {
    try {
      response?.members?.forEach(async (member) => {
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
  const createChannelJson = (response, selectedUser) => {
    const channelWithMember = {...response.channel, members: response.members};
    const targetRawJson = {
      type: 'notification.message_new',
      cid: response?.channel?.id,
      channel_id: '',
      channel_type: 'messaging',
      channel: channelWithMember,
      created_at: response?.channel,
      targetName: selectedUser?.user?.username || selectedUser?.user?.username,
      targetImage: selectedUser?.user?.profilePicture || selectedUser?.user?.profilePicture
    };
    const chatData = {
      channel: response?.channel,
      members: response?.members,
      appAdditionalData: {
        rawJson: targetRawJson,
        message: '',
        targetName: selectedUser?.user?.username || selectedUser?.user?.username,
        targetImage: selectedUser?.user?.profilePicture || selectedUser?.user?.profilePicture
      }
    };
    return chatData;
  };

  const createSignChat = async (members: string[], selectedUser, from) => {
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
    handleAnonymousMessage,
    loadingCreateChat
  };
};

export default useCreateChat;
