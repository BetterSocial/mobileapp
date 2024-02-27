import {v4 as uuid} from 'uuid';
import useLocalDatabaseHook from '../../../database/hooks/useLocalDatabaseHook';
import ChannelListMemberSchema from '../../../database/schema/ChannelListMemberSchema';
import ChannelList from '../../../database/schema/ChannelListSchema';
import ChatSchema from '../../../database/schema/ChatSchema';
import UserSchema from '../../../database/schema/UserSchema';
import {DEFAULT_PROFILE_PIC_PATH} from '../../../utils/constants';
import useUserAuthHook from '../auth/useUserAuthHook';
import useChatUtilsHook from './useChatUtilsHook';
import {initChatFromPost, initChatFromPostAnon} from '../../../service/chat';

type ChannelCategory = 'SIGNED' | 'ANONYMOUS';

const useDMMessage = () => {
  const {localDb, refresh} = useLocalDatabaseHook();
  const {signedProfileId, anonProfileId} = useUserAuthHook();
  const {goToChatScreen} = useChatUtilsHook();

  const saveChannelList = async (channel, type: ChannelCategory) => {
    try {
      if (channel?.members?.length === 0) return Promise.reject(Error('no members'));
      let userTarget = channel?.better_channel_members.find(
        (data) => data?.user?.id !== signedProfileId
      );

      if (type === 'ANONYMOUS') {
        userTarget = channel?.better_channel_members.find(
          (data) => data?.user?.id !== anonProfileId
        );
      }

      const chatType = type === 'ANONYMOUS' ? 'ANON_PM' : 'PM';
      const chatName = {
        name: userTarget?.user?.name || userTarget?.user?.username,
        image: userTarget?.user?.image || DEFAULT_PROFILE_PIC_PATH
      };

      channel.firstMessage = channel?.messages?.[channel?.messages?.length - 1];
      channel.myUserId = signedProfileId; // change to use getChannelListInfo
      channel.targetName = chatName?.name; // change to use getChannelListInfo
      channel.targetImage = chatName?.image; // change to use getChannelListInfo

      channel.channel = {...channel};
      const channelList = ChannelList.fromChannelAPI(channel, chatType, channel?.members);
      await channelList.saveIfLatest(localDb);
      refresh('channelList', 'chat', 'channelInfo', 'channelMember');
      return goToChatScreen(channelList);
    } catch (error) {
      console.log('sendMessage', error);
    }
  };

  const sendMessageDM = async (
    id,
    source: 'post' | 'comment',
    channelCategory: ChannelCategory
  ) => {
    const initChat =
      channelCategory === 'ANONYMOUS'
        ? await initChatFromPostAnon({source, id})
        : await initChatFromPost({source, id});

    const channel = {
      ...initChat?.data?.channel,
      better_channel_members: initChat?.data?.better_channel_members,
      members: initChat?.data?.better_channel_members
    };

    if (!channel?.members?.length) {
      console.info('no members');
      return;
    }

    if (channel?.type === 'topics') {
      console.info('type is topics');
      return;
    }

    try {
      await Promise.all(
        (channel?.members || []).map(async (member) => {
          const userMember = UserSchema.fromMemberWebsocketObject(member, channel?.id);
          const memberSchema = ChannelListMemberSchema.fromWebsocketObject(
            channel?.id,
            uuid(),
            member // change to use getChannelListInfo
          );
          await userMember.saveOrUpdateIfExists(localDb);
          await memberSchema.save(localDb);
        })
      );

      await Promise.all(
        (channel?.messages || []).map(async (message) => {
          if (message?.type === 'deleted') return;
          const chat = ChatSchema.fromGetAllChannelAPI(channel?.id, message);
          await chat.save(localDb);
        })
      );

      await saveChannelList(channel, channelCategory);
    } catch (e) {
      console.log('error on saveChannelData', e);
    }
  };

  return {
    sendMessageDM
  };
};

export default useDMMessage;
