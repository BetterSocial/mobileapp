import AnonymousMessageRepo from '../../../service/repo/anonymousMessageRepo';
import ChannelList from '../../../database/schema/ChannelListSchema';
import ChatSchema from '../../../database/schema/ChatSchema';
import SignedMessageRepo from '../../../service/repo/signedMessageRepo';
import UserSchema from '../../../database/schema/UserSchema';
import useLocalDatabaseHook from '../../../database/hooks/useLocalDatabaseHook';
import useUserAuthHook from '../auth/useUserAuthHook';
import {ANONYMOUS} from '../constant';
import {AnonUserInfo} from '../../../../types/service/AnonProfile.type';
import {ChannelData, ChannelType} from '../../../../types/repo/ChannelData';
import {DELETED_MESSAGE_TEXT, MESSAGE_TYPE_DELETED} from '../../../utils/constants';
import {getChannelListInfo, getChannelMembers} from '../../../utils/string/StringUtils';

type ChannelCategory = 'SIGNED' | 'ANONYMOUS';

const useFetchChannelHook = () => {
  const {localDb, refresh} = useLocalDatabaseHook();
  const {signedProfileId, anonProfileId} = useUserAuthHook();

  const helperFollowingSystemMessage = (message) => {
    if (message?.system_user === signedProfileId) {
      message.text = message?.own_text;
    } else {
      message.text = message?.other_text;
    }
    /**
     * TODO: Handle follow anonymous user system message later, if any
     * */

    return message;
  };

  const helperChannelPromiseBuilder = async (channel, channelCategory: ChannelCategory) => {
    if (channel?.members?.length === 0) return Promise.reject(Error('no members'));

    const isAnonymous = channelCategory === ANONYMOUS;
    const type: {[key: string]: ChannelType} = {
      messaging: isAnonymous ? 'ANON_PM' : 'PM',
      group: 'GROUP',
      topics: isAnonymous ? 'ANON_TOPIC' : 'TOPIC'
    };

    const channelListInfo = getChannelListInfo(channel, signedProfileId, anonProfileId);
    const anonUserInfo: AnonUserInfo | undefined = {
      anon_user_info_emoji_name: channelListInfo?.anonUserInfoEmojiName,
      anon_user_info_emoji_code: channelListInfo?.anonUserInfoEmojiCode,
      anon_user_info_color_name: channelListInfo?.anonUserInfoColorName,
      anon_user_info_color_code: channelListInfo?.anonUserInfoColorCode
    };

    channel.targetName = channelListInfo?.channelName;
    channel.targetImage = channelListInfo?.channelImage;

    if (isAnonymous) {
      channel.firstMessage = channel?.messages?.[0];
    } else {
      channel.firstMessage = channel?.messages?.[channel?.messages?.length - 1];
      channel.myUserId = signedProfileId;
      if (channel.firstMessage?.type === 'system') {
        channel.firstMessage = helperFollowingSystemMessage(channel.firstMessage);
      }
    }

    const isDeletedMessage = channel.firstMessage?.message_type === MESSAGE_TYPE_DELETED;
    if (isDeletedMessage) channel.firstMessage.text = DELETED_MESSAGE_TEXT;

    channel.channel = {...channel};
    const channelType = channel?.type;

    try {
      const channelList = ChannelList.fromChannelAPI(
        channel,
        type[channelType],
        undefined,
        anonUserInfo
      );

      await channelList.saveIfLatest(localDb);
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
      const members = getChannelMembers(channel);

      const memberPromise = (members || []).map((member) => {
        const userMember = UserSchema.fromMemberWebsocketObject(member, channel?.id);
        return new Promise((resolve) => {
          UserSchema.isUserExists(localDb, member?.user?.id, channel?.id).then((isUserExists) => {
            if (!member?.user?.username) return resolve(true);
            if (!isUserExists) {
              userMember.save(localDb).then(() => {
                return resolve(true);
              });
            } else {
              return resolve(true);
            }
          });
        });
      });

      const messagePromise = (channel?.messages || []).map((message) => {
        return new Promise((resolve) => {
          if (message?.type === 'deleted') {
            resolve(true);
            return;
          }
          if (message?.type === 'system') {
            message = helperFollowingSystemMessage(message);
          }
          const chat = ChatSchema.fromGetAllChannelAPI(channel?.id, message);
          chat.saveIfNotExist(localDb).then(() => {
            resolve(true);
            refresh('chats');
          });
        });
      });

      const allPromises = [...memberPromise, ...messagePromise];
      await Promise.all(allPromises);
    } catch (e) {
      console.log('error on saveChannelData:', e);
    }
  };

  const filterChannels = (channels) => {
    return channels.filter((channel) => {
      const isLocationChannel = channel?.channel_type === 2 || channel?.type_channel === 2;
      const isSelfChatChannel = channel?.type === 'messaging' && channel?.members?.length < 2;
      const isCommunityChannel = channel?.type === 'topics';

      const isDeletedMessage = channel?.firstMessage?.type === 'deleted';
      const hasDeletedMessage = channel?.messages[channel?.messages?.length - 1]?.text
        ?.toLowerCase()
        ?.includes('this message was deleted');

      const isDeletedMessageOrSelfChat = isDeletedMessage || isSelfChatChannel;
      const isDeletedOrHasDeletedMessage = isDeletedMessage || hasDeletedMessage;
      const isCommunityHasDeletedMessage = isDeletedOrHasDeletedMessage && isCommunityChannel;

      return !isLocationChannel && !isDeletedMessageOrSelfChat && !isCommunityHasDeletedMessage;
    });
  };

  const saveAllChannelData = async (channels, channelCategory: ChannelCategory) => {
    const filteredChannels = filterChannels(channels);

    const channelPromises = filteredChannels?.map((channel) => {
      return Promise.resolve(saveChannelData(channel, channelCategory));
    });

    await Promise.all(channelPromises);
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
