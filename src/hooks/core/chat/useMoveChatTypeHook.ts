import {v4 as uuid} from 'uuid';

import ChannelList from '../../../database/schema/ChannelListSchema';
import ChannelListMemberSchema from '../../../database/schema/ChannelListMemberSchema';
import ChatSchema from '../../../database/schema/ChatSchema';
import UserSchema from '../../../database/schema/UserSchema';
import useChatUtilsHook from './useChatUtilsHook';
import useLocalDatabaseHook from '../../../database/hooks/useLocalDatabaseHook';
import useUserAuthHook from '../auth/useUserAuthHook';
import {ANONYMOUS} from '../constant';
import {AnonUserInfo} from '../../../../types/service/AnonProfile.type';
import {ChannelType} from '../../../../types/repo/ChannelData';
import {generateAnonProfileOtherProfile} from '../../../service/anonymousProfile';
import {getChannelListInfo} from '../../../utils/string/StringUtils';
import {moveChatToAnon, moveChatToSigned} from '../../../service/chat';

type ChannelCategory = 'SIGNED' | 'ANONYMOUS';
interface MoveToChatChannelParams {
  targetUserId: string;
  oldChannelId: string;
  source: 'userId';
}

const useMoveChatTypeHook = () => {
  const {localDb, refresh} = useLocalDatabaseHook();
  const {signedProfileId, anonProfileId} = useUserAuthHook();
  const {goToMoveChat} = useChatUtilsHook();

  const saveChannelList = async (
    channel: any,
    channelCategory: ChannelCategory
  ): Promise<ChannelList | undefined> => {
    if (!channel?.members?.length) return Promise.reject(Error('no members'));

    const isAnonymous = channelCategory === ANONYMOUS;
    const type: {[key: string]: ChannelType} = {
      messaging: isAnonymous ? 'ANON_PM' : 'PM',
      group: 'GROUP',
      topics: 'TOPIC',
      topicinvitation: 'TOPIC'
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

    channel.firstMessage = isAnonymous
      ? channel?.messages?.[0]
      : channel?.messages?.[channel?.messages?.length - 1];
    channel.channel = {...channel};

    const channelType = channel?.type;
    const channelList = ChannelList.fromChannelAPI(
      channel,
      type[channelType],
      undefined,
      anonUserInfo
    );

    await channelList.saveIfLatest(localDb);
    refresh('channelList', 'chat', 'channelInfo', 'channelMember');
    goToMoveChat(channelList);

    return channelList;
  };

  const saveChannelData = async (channel: any, channelCategory: ChannelCategory): Promise<void> => {
    if (!channel?.members?.length) {
      console.info('no members');
      return;
    }

    if (channel?.type === 'topics' || channel?.type === 'topicinvitation') {
      console.info('type is topics');
      return;
    }

    try {
      const members = channel?.better_channel_member || channel?.members || [];
      await Promise.all(
        members?.map(async (member) => {
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
          if (message?.type === 'deleted') return;
          const chat = ChatSchema.fromGetAllChannelAPI(channel?.id, message);
          await chat.saveIfNotExist(localDb);
        })
      );

      await saveChannelList(channel, channelCategory);
    } catch (e) {
      console.log('error on saveChannelData', e);
    }
  };

  const moveToChannel = async (
    {
      targetUserId,
      oldChannelId,
      anonProfileResult,
      source
    }: MoveToChatChannelParams & {anonProfileResult?: any},
    channelCategory: ChannelCategory
  ): Promise<void> => {
    if (!localDb) return;
    try {
      const result = await (channelCategory === 'SIGNED'
        ? moveChatToSigned({targetUserId, oldChannelId, source})
        : moveChatToAnon({
            targetUserId,
            oldChannelId,
            anon_user_info_color_code: anonProfileResult?.anon_user_info_color_code,
            anon_user_info_color_name: anonProfileResult?.anon_user_info_color_name,
            anon_user_info_emoji_code: anonProfileResult?.anon_user_info_emoji_code,
            anon_user_info_emoji_name: anonProfileResult?.anon_user_info_emoji_name,
            source
          }));
      const messages = result?.data?.messageHistories?.map((item: any) => item?.message);
      const channel = {
        ...result?.data?.channel,
        better_channel_member: result?.data?.better_channel_members,
        members: result?.data?.better_channel_members,
        messages
      };

      await saveChannelData(channel, channelCategory);
    } catch (err) {
      console.log(`error on moveTo${channelCategory}Channel`, err);
    }
  };

  const moveToSignedChannel = async (params: MoveToChatChannelParams): Promise<void> => {
    await moveToChannel(params, 'SIGNED');
  };

  const moveToAnonymousChannel = async (params: MoveToChatChannelParams): Promise<void> => {
    const anonProfileResult = await generateAnonProfileOtherProfile(params.targetUserId);
    await moveToChannel({...params, anonProfileResult}, 'ANONYMOUS');
  };

  return {
    moveToSignedChannel,
    moveToAnonymousChannel
  };
};

export default useMoveChatTypeHook;
