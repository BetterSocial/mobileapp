import ChatSchema from '../schema/ChatSchema';
import useLocalDatabaseHook from './useLocalDatabaseHook';
import {
  InitAnonymousChatData,
  ModifyAnonymousChatData
} from '../../../types/repo/AnonymousMessageRepo/InitAnonymousChatData';
import {getAnonymousChatName} from '../../utils/string/StringUtils';

const useSaveAnonChatHook = () => {
  const {localDb, refresh} = useLocalDatabaseHook();

  const saveChatFromOtherProfile = async (object: InitAnonymousChatData) => {
    if (!localDb) return;

    console.log(`called ${new Date().getTime()}`);
    const chatName = await getAnonymousChatName(object?.members);
    const initAnonymousChat: ModifyAnonymousChatData = {
      ...object,
      targetName: chatName?.name,
      targetImage: chatName?.image
    };

    initAnonymousChat.message.cid = initAnonymousChat.message.cid.replace('messaging:', '');

    const chat = ChatSchema.fromInitAnonymousChatAPI(initAnonymousChat);
    await chat.save(localDb);

    refresh('channelList');
    refresh('chat');
  };

  return {
    saveChatFromOtherProfile
  };
};

export default useSaveAnonChatHook;
