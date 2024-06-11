import SimpleToast from 'react-native-simple-toast';

import AnonymousMessageRepo from '../../../service/repo/anonymousMessageRepo';
import ChatSchema from '../../../database/schema/ChatSchema';
import ShareUtils from '../../../utils/share';
import SignedMessageRepo from '../../../service/repo/signedMessageRepo';
import useLocalDatabaseHook from '../../../database/hooks/useLocalDatabaseHook';

const useMessageHook = (message: ChatSchema | undefined) => {
  const {localDb, refreshWithId} = useLocalDatabaseHook();

  const copyMessage = () => {
    if (!message) return;
    ShareUtils.copyMessageWithoutLink(message.message);
  };

  const deleteMessage = async (iteration = 0) => {
    if (!message || !localDb) return;

    if (iteration > 5) {
      SimpleToast.show("Can't delete message, please check your connection");
      return;
    }

    try {
      await ChatSchema.updateDeletedChatType(localDb, message?.id, message);
      refreshWithId('chat', message?.channelId);

      if (message?.type === 'ANONYMOUS') {
        await AnonymousMessageRepo.deleteMessage(message?.id);
      } else {
        await SignedMessageRepo.deleteMessage(message?.id);
      }
    } catch (error) {
      console.log('error on delete message:', error);
      setTimeout(() => {
        deleteMessage(iteration + 1).catch((e) => console.log(e));
      }, 1000);
    }
  };

  return {
    copyMessage,
    deleteMessage
  };
};

export default useMessageHook;
