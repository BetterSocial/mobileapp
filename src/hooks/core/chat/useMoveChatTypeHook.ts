import {v4 as uuid} from 'uuid';
import useLocalDatabaseHook from '../../../database/hooks/useLocalDatabaseHook';
import ChannelListMemberSchema from '../../../database/schema/ChannelListMemberSchema';
import ChannelList from '../../../database/schema/ChannelListSchema';
import ChatSchema from '../../../database/schema/ChatSchema';
import UserSchema from '../../../database/schema/UserSchema';
import {moveChatToSigned, moveChatToAnon} from '../../../service/chat';
import {DEFAULT_PROFILE_PIC_PATH} from '../../../utils/constants';
import useUserAuthHook from '../auth/useUserAuthHook';
import useChatUtilsHook from './useChatUtilsHook';
import {generateAnonProfileOtherProfile} from '../../../service/anonymousProfile';

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
    type: ChannelCategory
  ): Promise<ChannelList | undefined> => {
    if (!channel?.members?.length) return Promise.reject(Error('no members'));
    const mambers = channel?.better_channel_members.find(
      (member) => member?.user_id !== signedProfileId
    );
    const mambersAnon = channel?.better_channel_members.find(
      (member) => member?.user_id !== anonProfileId
    );
    const channelPicture =
      type === 'ANONYMOUS'
        ? mambersAnon?.user?.image || DEFAULT_PROFILE_PIC_PATH
        : mambers?.user?.image || DEFAULT_PROFILE_PIC_PATH;
    const name =
      type === 'ANONYMOUS'
        ? mambersAnon?.user?.name || mambersAnon?.user?.username
        : mambers?.user?.name || mambers?.user?.username;
    const channelList = ChannelList.mappingChannelList({
      id: channel?.id,
      channelPicture,
      channelType: type === 'ANONYMOUS' ? 'ANON_PM' : 'PM',
      name,
      description: '',
      createdAt: channel?.created_at,
      lastUpdatedAt: channel?.updated_at,
      lastUpdatedBy: channel?.lastUpdatedBy,
      unreadCount: 0,
      members: channel?.better_channel_members,
      rawJson: {...channel, channel},
      user: null
    });

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
        better_channel_members: result?.data?.better_channel_members,
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
