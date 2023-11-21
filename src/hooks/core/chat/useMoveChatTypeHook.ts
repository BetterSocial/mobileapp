import {v4 as uuid} from 'uuid';
import {ChannelType} from '../../../../types/repo/ChannelData';
import useLocalDatabaseHook from '../../../database/hooks/useLocalDatabaseHook';
import ChannelListMemberSchema from '../../../database/schema/ChannelListMemberSchema';
import ChannelList from '../../../database/schema/ChannelListSchema';
import ChatSchema from '../../../database/schema/ChatSchema';
import UserSchema from '../../../database/schema/UserSchema';
import {moveChatToSigned} from '../../../service/chat';
import {DEFAULT_PROFILE_PIC_PATH} from '../../../utils/constants';
import {getAnonymousChatName, getChatName} from '../../../utils/string/StringUtils';
import useUserAuthHook from '../auth/useUserAuthHook';
import {ANONYMOUS, ANON_PM} from '../constant';
import useChatUtilsHook from './useChatUtilsHook';

type ChannelCategory = 'SIGNED' | 'ANONYMOUS';
interface MoveToSignedChannelParams {
  targetUserId: string;
  oldChannelId: string;
}

const useMoveChatTypeHook = () => {
  const {localDb, refresh} = useLocalDatabaseHook();
  const {signedProfileId} = useUserAuthHook();

  const {goToMoveChat} = useChatUtilsHook();

  const saveChannelList = async (channel: any, channelCategory: ChannelCategory) => {
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
        signedChannelImage = channel?.channel_image;
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
    channel.channel = {...channel};
    const channelType = channel?.type;

    const channelList = ChannelList.fromChannelAPI(channel, type[channelType]);
    await channelList.saveIfLatest(localDb);
    refresh('channelList');
    goToMoveChat(channelList);
    return channelList;
  };

  const saveChannelData = async (channel: any, channelCategory: ChannelCategory) => {
    if (!channel?.members || channel?.members?.length === 0) return console.info('no members');
    if (channel?.type === 'topics') return console.info('type is topics');

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

      return await saveChannelList(channel, channelCategory);
    } catch (e) {
      console.log('error on saveChannelData', e);
      return e;
    }
  };

  const moveToSignedChannel = async ({targetUserId, oldChannelId}: MoveToSignedChannelParams) => {
    if (!localDb) return;
    try {
      const result = await moveChatToSigned({targetUserId, oldChannelId});
      const messages = result?.data?.messageHistories?.map((item) => {
        return item?.message;
      });
      const channel = {
        ...result?.data?.channel,
        members: result?.data?.members,
        messages
      };
      await saveChannelData(channel, 'SIGNED');
      refresh('channelList');
    } catch (err) {
      console.log('error on moveToSignedChannel', err);
    }
  };

  const moveToAnonymousChannel = async () => {
    if (!localDb) return;
    try {
      const result = await moveChatToSigned({targetUserId: '', oldChannelId: ''});
      const messages = result?.data?.messageHistories?.map((item) => {
        return item?.message;
      });
      const channel = {
        ...result?.data?.channel,
        members: result?.data?.members,
        messages
      };
      await saveChannelData(channel, 'ANONYMOUS');
      refresh('channelList');
    } catch (err) {
      console.log('error on moveToAnonymousChannel', err);
    }
  };

  return {
    moveToSignedChannel,
    moveToAnonymousChannel
  };
};

export default useMoveChatTypeHook;
