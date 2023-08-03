import ChannelListMemberSchema from '../schema/ChannelListMemberSchema';
import ChannelListSchema from '../schema/ChannelListSchema';
import ChatSchema from '../schema/ChatSchema';
import UserSchema from '../schema/UserSchema';
import useLocalDatabaseHook from './useLocalDatabaseHook';
import {
  InitAnonymousChatData,
  ModifyAnonymousChatData
} from '../../../types/repo/AnonymousMessageRepo/InitAnonymousChatData';
import {getAnonymousChatName} from '../../utils/string/StringUtils';

const useSaveAnonChatHook = () => {
  const {localDb, refresh} = useLocalDatabaseHook();

  const saveChatFromOtherProfile = async (object: InitAnonymousChatData, status = 'sent') => {
    if (!localDb) return;

    const chatName = await getAnonymousChatName(object?.members);
    const initAnonymousChat: ModifyAnonymousChatData = {
      ...object,
      targetName: chatName?.name,
      targetImage: chatName?.image
    };

    initAnonymousChat.message.cid = initAnonymousChat.message.cid.replace('messaging:', '');

    const chat = ChatSchema.fromInitAnonymousChatAPI(initAnonymousChat, status);
    await chat.save(localDb);

    try {
      object?.members?.forEach((member) => {
        const userMember = UserSchema.fromInitAnonymousChatAPI(
          member,
          initAnonymousChat?.message?.cid
        );
        userMember.saveOrUpdateIfExists(localDb);

        const memberSchema = ChannelListMemberSchema.fromInitAnonymousChatAPI(
          initAnonymousChat?.message?.cid,
          object?.message?.id,
          member
        );

        memberSchema.save(localDb);
      });
    } catch (e) {
      console.log('error saveChatFromOtherProfile');
      console.log(e);
    }

    refresh('channelList');
    refresh('chat');
  };

  const helperUpdateChannelListDescription = async (object: InitAnonymousChatData) => {
    const channelId = object?.message?.cid?.replace('messaging:', '');
    const channelList = await ChannelListSchema.getById(localDb, channelId);

    const channelListSchema = ChannelListSchema.fromDatabaseObject(channelList);
    channelListSchema.description = object?.message?.text;
    channelListSchema.lastUpdatedAt = new Date().toISOString();
    channelListSchema.lastUpdatedBy = object?.message?.user?.id;
    channelListSchema.save(localDb);
  };

  const savePendingChatFromOtherProfile = async (object: InitAnonymousChatData) => {
    try {
      helperUpdateChannelListDescription(object);
      saveChatFromOtherProfile(object, 'pending');
    } catch (e) {
      console.log('error savePendingChatFromOtherProfile', e);
    }
  };

  return {
    saveChatFromOtherProfile,
    savePendingChatFromOtherProfile
  };
};

export default useSaveAnonChatHook;
