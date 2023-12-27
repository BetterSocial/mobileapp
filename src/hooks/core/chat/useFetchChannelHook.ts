import {v4 as uuid} from 'uuid';

import AnonymousMessageRepo from '../../../service/repo/anonymousMessageRepo';
import ChannelList from '../../../database/schema/ChannelListSchema';
import ChannelListMemberSchema from '../../../database/schema/ChannelListMemberSchema';
import ChatSchema from '../../../database/schema/ChatSchema';
import SignedMessageRepo from '../../../service/repo/signedMessageRepo';
import UserSchema from '../../../database/schema/UserSchema';
import useLocalDatabaseHook from '../../../database/hooks/useLocalDatabaseHook';
import useUserAuthHook from '../auth/useUserAuthHook';
import {ANONYMOUS} from '../constant';
import {ChannelData, ChannelType} from '../../../../types/repo/ChannelData';
import {
  DEFAULT_PROFILE_PIC_PATH,
  DELETED_MESSAGE_TEXT,
  MESSAGE_TYPE_DELETED
} from '../../../utils/constants';
import {getAnonymousChatName, getChatName} from '../../../utils/string/StringUtils';

type ChannelCategory = 'SIGNED' | 'ANONYMOUS';

const useFetchChannelHook = () => {
  const {localDb, refresh} = useLocalDatabaseHook();
  const {signedProfileId} = useUserAuthHook();

  const helperChannelPromiseBuilder = async (channel, channelCategory: ChannelCategory) => {
    if (channel?.members?.length === 0) return Promise.reject(Error('no members'));

    const isAnonymous = channelCategory === ANONYMOUS;
    const type: {[key: string]: ChannelType} = {
      messaging: isAnonymous ? 'ANON_PM' : 'PM',
      group: 'GROUP',
      topics: 'TOPIC'
    };

    let signedChannelName;
    let signedChannelImage;

    if (!isAnonymous) {
      const myUserData = channel?.members?.find(
        (member) => member?.user?.id === signedProfileId
      )?.user;
      const signedChannelUsername = myUserData?.username ?? myUserData?.name;
      signedChannelName =
        channel?.channel_type === 4
          ? `Anonymous ${channel?.anon_user_info_emoji_name}`
          : getChatName(channel?.name, signedChannelUsername);

      if (channel?.type === 'group' || channel?.type === 'topics') {
        signedChannelImage = channel?.channel_image ?? channel.image;
      } else {
        signedChannelImage =
          channel?.members?.find((member) => member?.user_id !== signedProfileId)?.user?.image ??
          DEFAULT_PROFILE_PIC_PATH;
      }
    }

    const chatName = isAnonymous
      ? await getAnonymousChatName(channel?.members)
      : {name: signedChannelName, image: signedChannelImage};

    channel.targetName = chatName?.name;
    channel.targetImage = chatName?.image;
    if (isAnonymous) {
      channel.firstMessage = channel?.messages?.[0];
    } else {
      channel.firstMessage = channel?.messages?.[channel?.messages?.length - 1];
      channel.myUserId = signedProfileId;
    }

    const isDeletedMessage = channel.firstMessage?.message_type === MESSAGE_TYPE_DELETED;
    if (isDeletedMessage) channel.firstMessage.text = DELETED_MESSAGE_TEXT;

    channel.channel = {...channel};
    const channelType = channel?.type;

    try {
      const channelList = ChannelList.fromChannelAPI(channel, type[channelType]);
      if (channel?.type === 'topics') {
        await channelList.save(localDb);
      } else {
        await channelList.saveIfLatest(localDb);
      }
      refresh('channelList');
    } catch (e) {
      console.log('error on helperChannelPromiseBuilder');
    }
    return null;
  };

  const saveChannelData = async (channel, channelCategory: ChannelCategory) => {
    if (!channel?.members || channel?.members?.length === 0) return;

    try {
      await helperChannelPromiseBuilder(channel, channelCategory);
    } catch (e) {
      console.log('error on saveChannelData helperChannelPromiseBuilder:', e);
    }

    if (channel?.type === 'topics') return;

    try {
      await Promise.all(
        (channel?.members || []).map(async (member) => {
          const userMember = UserSchema.fromMemberWebsocketObject(member, channel?.id);
          const memberSchema = ChannelListMemberSchema.fromWebsocketObject(
            channel?.id,
            uuid(),
            member
          );
          await userMember.saveOrUpdateIfExists(localDb);
          await memberSchema.save(localDb);
        })
      );

      await Promise.all(
        (channel?.messages || []).map(async (message) => {
          const isDeletedMessage = message?.message_type === MESSAGE_TYPE_DELETED;
          const isDeletedHelper = Boolean(message?.deleted_message_id);
          if (isDeletedMessage && isDeletedHelper) return;

          if (isDeletedMessage) message.text = DELETED_MESSAGE_TEXT;
          const chat = ChatSchema.fromGetAllChannelAPI(channel?.id, message);
          await chat.save(localDb);
        })
      );
    } catch (e) {
      console.log('error on saveChannelData:', e);
    }
  };

  const filterChannels = (channels) => {
    return channels.filter((channel) => {
      const isLocationChannel = channel?.channel_type === 2 || channel?.type_channel === 2;
      const isSelfChatChannel = channel?.type === 'messaging' && channel?.members?.length < 2;
      const isCommunityChannel = channel?.type === 'topics';

      const isDeletedMessage = channel?.firstMessage?.type === MESSAGE_TYPE_DELETED;
      const hasDeletedMessage = channel?.messages[channel?.messages?.length - 1]?.text
        ?.toLowerCase()
        ?.includes('this message was deleted');

      const isDeletedOrHasDeletedMessage = isDeletedMessage || hasDeletedMessage;
      const isCommunityHasDeletedMessage = isDeletedOrHasDeletedMessage && isCommunityChannel;

      return !isLocationChannel && !isSelfChatChannel && !isCommunityHasDeletedMessage;
    });
  };

  const saveAllChannelData = async (channels, channelCategory: ChannelCategory) => {
    const filteredChannels = filterChannels(channels);

    filteredChannels?.forEach(async (channel) => {
      await saveChannelData(channel, channelCategory);
    });
  };

  const getAllSignedChannels = async () => {
    if (!localDb) return;
    let signedChannel;

    try {
      signedChannel = await SignedMessageRepo.getAllSignedChannels();
    } catch (e) {
      console.log('error on getting signedChannel:', e);
    }
    try {
      await saveAllChannelData(signedChannel ?? [], 'SIGNED');
      refresh('channelList');
    } catch (e) {
      console.log('error on saving signedChannel:', e);
    }
  };

  const getAllAnonymousChannels = async () => {
    if (!localDb) return;
    let anonymousChannel: ChannelData[] = [];
    try {
      anonymousChannel = await AnonymousMessageRepo.getAllAnonymousChannels();
    } catch (e) {
      console.log('error on getting anonymousChannel:', e);
    }

    try {
      await saveAllChannelData(anonymousChannel, 'ANONYMOUS');
      refresh('channelList');
    } catch (e) {
      console.log('error on saving anonymousChannel:', e);
    }
  };

  return {
    getAllSignedChannels,
    getAllAnonymousChannels
  };
};

export default useFetchChannelHook;
