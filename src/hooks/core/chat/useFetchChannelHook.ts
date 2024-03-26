import {ChannelData, ChannelType} from '../../../../types/repo/ChannelData';
import {AnonUserInfo} from '../../../../types/service/AnonProfile.type';
import useLocalDatabaseHook from '../../../database/hooks/useLocalDatabaseHook';
import ChannelList from '../../../database/schema/ChannelListSchema';
import ChatSchema from '../../../database/schema/ChatSchema';
import UserSchema from '../../../database/schema/UserSchema';
import AnonymousMessageRepo from '../../../service/repo/anonymousMessageRepo';
import SignedMessageRepo from '../../../service/repo/signedMessageRepo';
import {DELETED_MESSAGE_TEXT, MESSAGE_TYPE_DELETED} from '../../../utils/constants';
import StorageUtils from '../../../utils/storage';
import {getChannelListInfo, getChannelMembers} from '../../../utils/string/StringUtils';
import useUserAuthHook from '../auth/useUserAuthHook';
import {ANONYMOUS} from '../constant';
import useDatabaseQueueHook from '../queue/useDatabaseQueueHook';
import useSystemMessage from './useSystemMessage';

type ChannelCategory = 'SIGNED' | 'ANONYMOUS';

const useFetchChannelHook = () => {
  const {localDb, refresh, refreshWithId} = useLocalDatabaseHook();
  const {signedProfileId, anonProfileId} = useUserAuthHook();
  const {getFirstMessage} = useSystemMessage();
  // const queue = DatabaseQueue.getInstance();
  const {queue} = useDatabaseQueueHook();

  const helperChannelPromiseBuilder = async (channel, channelCategory: ChannelCategory) => {
    if (channel?.members?.length === 0) return Promise.reject(Error('no members'));

    const isAnonymous = channelCategory === ANONYMOUS;
    const type: {[key: string]: ChannelType} = {
      messaging: isAnonymous ? 'ANON_PM' : 'PM',
      group: 'GROUP',
      topics: isAnonymous ? 'ANON_TOPIC' : 'TOPIC'
    };

    const newChannel = {...channel};

    const channelListInfo = getChannelListInfo(channel, signedProfileId, anonProfileId);
    const anonUserInfo: AnonUserInfo | undefined = {
      anon_user_info_emoji_name: channelListInfo?.anonUserInfoEmojiName,
      anon_user_info_emoji_code: channelListInfo?.anonUserInfoEmojiCode,
      anon_user_info_color_name: channelListInfo?.anonUserInfoColorName,
      anon_user_info_color_code: channelListInfo?.anonUserInfoColorCode
    };

    newChannel.targetName = channelListInfo?.channelName;
    newChannel.targetImage = channelListInfo?.channelImage;

    newChannel.firstMessage = getFirstMessage(channel?.messages);

    const isDeletedMessage = channel.firstMessage?.message_type === MESSAGE_TYPE_DELETED;
    if (isDeletedMessage) channel.firstMessage.text = DELETED_MESSAGE_TEXT;

    newChannel.channel = {...channel};
    const channelType = channel?.type;

    try {
      queue.addJob({
        label: `saveChannelData-${channel?.id}`,
        task: () => {
          return new Promise((resolve) => {
            const channelList = ChannelList.fromChannelAPI(
              newChannel,
              type[channelType],
              undefined,
              anonUserInfo
            );

            channelList.saveIfLatest(localDb).then(() => {
              refresh('channelList');
              resolve(true);
            });
          });
        }
      });
    } catch (e) {
      console.log('error on helperChannelPromiseBuilder', e);
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

      (members || []).map((member) => {
        const userMember = UserSchema.fromMemberWebsocketObject(member, channel?.id);
        queue.addJob({
          label: `saveUserMember-${member?.user?.id}`,
          task: () => {
            return new Promise((resolve) => {
              UserSchema.isUserExists(localDb, member?.user?.id, channel?.id).then(
                (isUserExists) => {
                  if (!member?.user?.username) return resolve(true);
                  if (!isUserExists) {
                    userMember.save(localDb).then(() => {
                      return resolve(true);
                    });
                  } else {
                    return resolve(true);
                  }
                }
              );
            });
          }
        });

        return null;
      });

      (channel?.messages || []).map((message) => {
        queue.addJob({
          label: `saveChat-${message?.id}`,
          task: () => {
            return new Promise((resolve) => {
              if (message?.type === 'deleted') {
                resolve(true);
                return;
              }
              if (message?.type === 'system') {
                message = getFirstMessage([message]);
              }
              const chat = ChatSchema.fromGetAllChannelAPI(channel?.id, message);
              chat.saveIfNotExist(localDb).then(() => {
                resolve(true);

                refreshWithId('chat', channel?.id);
              });
            });
          }
        });

        return null;
      });
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
      return new Promise((resolve, reject) => {
        try {
          resolve(saveChannelData(channel, channelCategory));
        } catch (error) {
          reject(error);
        }
      });
    });

    await Promise.all(channelPromises);
  };

  const getAllSignedChannels = async () => {
    if (!localDb) return;
    let signedChannel;

    try {
      const timeStamp = StorageUtils.channelSignedTimeStamps.get();
      signedChannel = await SignedMessageRepo.getAllSignedChannels(timeStamp as string);
    } catch (e) {
      console.log('error on getting signedChannel:', e);
    }

    try {
      if (Array.isArray(signedChannel) && signedChannel.length === 0) return;
      await saveAllChannelData(signedChannel, 'SIGNED');
      refresh('channelList');
      const timestamp = new Date().toISOString();
      StorageUtils.channelSignedTimeStamps.set(timestamp);
    } catch (e) {
      console.log('error on saving signedChannel:', e);
    }
  };

  const getAllAnonymousChannels = async () => {
    if (!localDb) return;
    let anonymousChannel: ChannelData[] = [];
    try {
      const timeStamp = StorageUtils.channelAnonTimeStamps.get();

      anonymousChannel = await AnonymousMessageRepo.getAllAnonymousChannels(timeStamp as string);
    } catch (e) {
      console.log('error on getting anonymousChannel:', e);
    }

    try {
      await saveAllChannelData(anonymousChannel, 'ANONYMOUS');
      refresh('channelList');
      const timestamp = new Date().toISOString();
      StorageUtils.channelAnonTimeStamps.set(timestamp);
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
