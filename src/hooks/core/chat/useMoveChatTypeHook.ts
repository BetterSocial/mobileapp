import {v4 as uuid} from 'uuid';
import {ChannelType} from '../../../../types/repo/ChannelData';
import useLocalDatabaseHook from '../../../database/hooks/useLocalDatabaseHook';
import ChannelListMemberSchema from '../../../database/schema/ChannelListMemberSchema';
import ChannelList from '../../../database/schema/ChannelListSchema';
import ChatSchema from '../../../database/schema/ChatSchema';
import UserSchema from '../../../database/schema/UserSchema';
import {moveChatToSigned, moveChatToAnon} from '../../../service/chat';
import {DEFAULT_PROFILE_PIC_PATH} from '../../../utils/constants';
import {getAnonymousChatName, getChatName} from '../../../utils/string/StringUtils';
import useUserAuthHook from '../auth/useUserAuthHook';
import {ANONYMOUS} from '../constant';
import useChatUtilsHook from './useChatUtilsHook';
import {generateAnonProfileOtherProfile} from '../../../service/anonymousProfile';

type ChannelCategory = 'SIGNED' | 'ANONYMOUS';
interface MoveToChatChannelParams {
  targetUserId: string;
  oldChannelId: string;
}

const useMoveChatTypeHook = () => {
  const {localDb, refresh} = useLocalDatabaseHook();
  const {signedProfileId} = useUserAuthHook();
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
      topics: 'TOPIC'
    };

    let signedChannelName;
    let signedChannelImage;

    if (!isAnonymous) {
      const myUserData = channel?.members?.find(
        (member) => member?.user?.id === signedProfileId
      )?.user;
      signedChannelName =
        channel?.channel_type === 4
          ? `Anonymous ${channel?.anon_user_info_emoji_name}`
          : getChatName(channel?.name, myUserData?.username ?? myUserData?.name);

      signedChannelImage =
        channel?.type === 'group' || channel?.type === 'topics'
          ? channel?.channel_image
          : channel?.members?.find((member) => member?.user_id !== signedProfileId)?.user?.image ??
            DEFAULT_PROFILE_PIC_PATH;

      channel.myUserId = signedProfileId;
    } else {
      channel.myUserId = undefined;
    }

    const chatName = isAnonymous
      ? await getAnonymousChatName(channel?.members)
      : {name: signedChannelName, image: signedChannelImage};

    channel.targetName = chatName?.name;
    channel.targetImage = chatName?.image;
    channel.firstMessage = isAnonymous
      ? channel?.messages?.[0]
      : channel?.messages?.[channel?.messages?.length - 1];
    channel.channel = {...channel};

    const channelType = channel?.type;
    const channelList = ChannelList.fromChannelAPI(channel, type[channelType], channel?.members);

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
      anonProfileResult
    }: MoveToChatChannelParams & {anonProfileResult?: any},
    channelCategory: ChannelCategory
  ): Promise<void> => {
    if (!localDb) return;

    try {
      const result = await (channelCategory === 'SIGNED'
        ? moveChatToSigned({targetUserId, oldChannelId})
        : moveChatToAnon({
            targetUserId,
            oldChannelId,
            anon_user_info_color_code: anonProfileResult?.anon_user_info_color_code,
            anon_user_info_color_name: anonProfileResult?.anon_user_info_color_name,
            anon_user_info_emoji_code: anonProfileResult?.anon_user_info_emoji_code,
            anon_user_info_emoji_name: anonProfileResult?.anon_user_info_emoji_name
          }));

      const messages = result?.data?.messageHistories?.map((item: any) => item?.message);
      const channel = {
        ...result?.data?.channel,
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
