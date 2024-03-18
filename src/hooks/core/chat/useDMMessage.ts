import {v4 as uuid} from 'uuid';
import useLocalDatabaseHook from '../../../database/hooks/useLocalDatabaseHook';
import ChannelListMemberSchema from '../../../database/schema/ChannelListMemberSchema';
import ChannelList from '../../../database/schema/ChannelListSchema';
import ChatSchema from '../../../database/schema/ChatSchema';
import UserSchema from '../../../database/schema/UserSchema';
import {initChatFromPost, initChatFromPostAnon} from '../../../service/chat';
import {getChannelListInfo} from '../../../utils/string/StringUtils';
import useUserAuthHook from '../auth/useUserAuthHook';
import useChatUtilsHook from './useChatUtilsHook';

type ChannelCategory = 'SIGNED' | 'ANONYMOUS';

const useDMMessage = () => {
  const {localDb, refresh} = useLocalDatabaseHook();
  const {signedProfileId, anonProfileId} = useUserAuthHook();
  const {goToChatScreen} = useChatUtilsHook();

  const saveChannelList = async (
    channel,
    type: ChannelCategory,
    builtChannelData: {
      better_channel_member: any;
      members: any;
    }
  ) => {
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

      const {
        anonUserInfoEmojiName,
        anonUserInfoColorCode,
        anonUserInfoColorName,
        anonUserInfoEmojiCode,
        channelName,
        channelImage
      } = getChannelListInfo(builtChannelData, signedProfileId, anonProfileId);

      const chatType = type === 'ANONYMOUS' ? 'ANON_PM' : 'PM';
      const chatName = {
        name: channelName,
        image: channelImage
      };

      channel.firstMessage = channel?.messages?.[channel?.messages?.length - 1];
      channel.myUserId = signedProfileId; // change to use getChannelListInfo
      channel.targetName = chatName?.name; // change to use getChannelListInfo
      channel.targetImage = chatName?.image; // change to use getChannelListInfo

      channel.channel = {...channel};
      console.log('data', {
        anon_user_info_color_name: anonUserInfoColorName,
        anon_user_info_color_code: anonUserInfoColorCode,
        anon_user_info_emoji_code: anonUserInfoEmojiCode,
        anon_user_info_emoji_name: anonUserInfoEmojiName
      });
      const channelList = ChannelList.fromChannelAPI(channel, chatType, channel?.members, {
        anon_user_info_color_name: anonUserInfoColorName,
        anon_user_info_color_code: anonUserInfoColorCode,
        anon_user_info_emoji_code: anonUserInfoEmojiCode,
        anon_user_info_emoji_name: anonUserInfoEmojiName
      });
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

    const builtChannelData = {
      better_channel_member: initChat.data.better_channel_members,
      members: initChat?.data.members
    };

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

      await saveChannelList(channel, channelCategory, builtChannelData);
    } catch (e) {
      console.log('error on saveChannelData', e);
    }
  };

  return {
    sendMessageDM
  };
};

export default useDMMessage;
