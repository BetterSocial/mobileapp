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
  const {localDb} = useLocalDatabaseHook();
  const {goToChatScreen} = useChatUtilsHook();
  const createSignChat = async (members: string[], selectedUser) => {
    try {
      const initChannel = await SignedMessageRepo.createSignedChat(members);
      const chatData = await createChannelJson(initChannel, selectedUser);
      console.log({initChannel, chatData}, 'nakal');

      const channelList = ChannelList.fromMessageSignedAPI(chatData);
      console.log({channelList}, 'nakal2');
      await channelList.saveIfLatest(localDb).catch((e) => console.log(e, 'nakal e'));
      console.log('nakal3');
      handleMemberSchema(initChannel);
      goToChatScreen(channelList, GROUP_INFO);
    } catch (e) {
      console.log({e}, 'eman');
    }
  };

  const createChannelJson = (response, selectedUser) => {
    const targetRawJson = {
      type: 'notification.message_new',
      cid: response?.channel?.id,
      channel_id: '',
      channel_type: 'messaging',
      channel: response?.channel,
      created_at: response?.channel,
      targetName: selectedUser?.user?.name,
      targetImage: selectedUser?.user?.image
    };
    const chatData = {
      channel: response?.channel,
      members: response?.members,
      appAdditionalData: {
        rawJson: targetRawJson,
        message: '',
        targetName: selectedUser?.user?.name,
        targetImage: selectedUser?.user?.image
      }
    };
    return chatData;
  };

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
      console.log('error on memberSchema');
      console.log(e);
    }
  };

  const handleAnonymousMessage = async (selectedUser) => {
    if (!selectedUser?.allow_anon_dm) {
      SimpleToast.show('This user does not allow anonymous messages');
      return;
    }

    try {
      const response = await getOrCreateAnonymousChannel(selectedUser?.user_id);
      const chatData = await createChannelJson(response, selectedUser);
      const channelList = ChannelList.fromMessageAnonymouslyAPI(chatData);
      console.log({chatData}, 'nakal2');
      await channelList.saveIfLatest(localDb);
      handleMemberSchema(response);
      goToChatScreen(channelList);
    } catch (e) {
      SimpleToast.show(e || 'Failed to message this user anonymously');
    }
  };

  return {
    createSignChat,
    handleAnonymousMessage
  };
};

export default useCreateChat;
