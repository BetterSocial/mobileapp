/* eslint-disable no-continue */
import moment from 'moment';

import useUserAuthHook from '../auth/useUserAuthHook';
import {GetstreamMessage} from '../websocket/types.d';

const useSystemMessage = () => {
  const {isMe} = useUserAuthHook();

  function __isSystemMessage(message: GetstreamMessage | null | undefined): boolean {
    return message?.type === 'system' || message?.isSystem === true;
  }

  function __isMessageOnlyForSystemUser(message: GetstreamMessage): boolean {
    return message?.only_show_to_system_user === true;
  }

  function __isMessageForOtherUser(message: GetstreamMessage): boolean {
    return isMe(message?.other_system_user);
  }

  function __isMySystemMessage(message: GetstreamMessage): boolean {
    return isMe(message?.system_user);
  }

  function checkSystemMessageOnlyForSystemUser(message: GetstreamMessage): GetstreamMessage {
    if (__isSystemMessage(message) && __isMessageOnlyForSystemUser(message)) {
      message.text = message?.own_text || '';
    }

    return message;
  }

  function checkSystemMessageOnlyForOtherSystemUser(message: GetstreamMessage): GetstreamMessage {
    if (__isSystemMessage(message) && __isMessageForOtherUser(message)) {
      message.text = message?.other_text || '';
    }

    return message;
  }

  function checkSystemMessage(message: GetstreamMessage): GetstreamMessage {
    if (__isSystemMessage(message)) {
      if (isMe(message?.system_user)) {
        message.text = message?.own_text || '';
      } else {
        message.text = message?.text || '';
      }
    }

    // console.log('message', message);
    return message;
  }

  async function saveSystemMessageFromWebsocket(
    message: GetstreamMessage,
    saveSystemMessageCallback: SaveSystemMessageCallback
  ): Promise<boolean> {
    // If the callback is not provided, do nothing
    // console.log('checkpoint1');
    if (!saveSystemMessageCallback) return false;

    // console.log('checkpoint2');
    // If the message is a follow topic message, do nothing
    if (message?.text?.toLocaleLowerCase()?.includes('this topic has new')) return false;

    // console.log('checkpoint3');
    // If the message is a system message, save the message
    if (__isMessageOnlyForSystemUser(message) && __isMySystemMessage(message)) {
      const newMessage = checkSystemMessageOnlyForSystemUser(message);
      saveSystemMessageCallback?.(newMessage);
      return true;
    }

    // console.log('checkpoint 3.5');
    if (__isMessageOnlyForSystemUser(message) && !__isMySystemMessage(message)) return false;

    // console.log('checkpoint4');
    if (__isMessageForOtherUser(message)) {
      const newMessage = checkSystemMessageOnlyForOtherSystemUser(message);
      saveSystemMessageCallback?.(newMessage);
      return true;
    }

    // console.log('checkpoint5');
    // If the message is a system message, save the message
    if (__isSystemMessage(message)) {
      const newMessage = checkSystemMessage(message);
      saveSystemMessageCallback?.(newMessage);
      return true;
    }

    // console.log('checkpoint6');
    if (message?.better_type) {
      saveSystemMessageCallback?.(message);
      return true;
    }

    // console.log('checkpoint7');
    return false;
  }

  function getFirstMessage(messages: GetstreamMessage[]): GetstreamMessage | null | undefined {
    if (!messages) return null;
    if (messages.length === 0) return null;
    const sortedMessages = [...messages]?.sort((a, b) =>
      moment(b?.updated_at).diff(moment(a?.updated_at))
    );

    let firstMessage: GetstreamMessage | null | undefined = null;
    while (sortedMessages?.length > 0) {
      const checkFirstMessage = sortedMessages?.at(0);
      if (!__isSystemMessage(checkFirstMessage)) {
        firstMessage = checkFirstMessage;
        break;
      }

      if (checkFirstMessage?.text?.toLocaleLowerCase()?.includes('this topic has new')) {
        sortedMessages.shift();
        continue;
      }

      if (checkFirstMessage?.text?.toLocaleLowerCase()?.includes('you joined this community')) {
        if (isMe(checkFirstMessage?.system_user)) {
          firstMessage = checkFirstMessage;
          break;
        }

        sortedMessages?.shift();
        continue;
      }

      if (
        __isMessageOnlyForSystemUser(sortedMessages[0]) &&
        __isMySystemMessage(sortedMessages[0])
      ) {
        firstMessage = checkSystemMessageOnlyForSystemUser(sortedMessages[0]);
        break;
      }

      if (
        __isMessageOnlyForSystemUser(sortedMessages[0]) &&
        !__isMySystemMessage(sortedMessages[0])
      ) {
        sortedMessages.shift();
        continue;
      }

      if (__isMessageForOtherUser(sortedMessages[0])) {
        firstMessage = checkSystemMessageOnlyForOtherSystemUser(sortedMessages[0]);
        break;
      }

      if (__isSystemMessage(sortedMessages[0])) {
        firstMessage = checkSystemMessage(sortedMessages[0]);
        break;
      }

      if (checkFirstMessage?.text?.toLocaleLowerCase()?.includes('started following')) {
        firstMessage = checkFirstMessage;
        break;
      }

      sortedMessages.shift();
    }

    return firstMessage;
  }

  return {
    saveSystemMessageFromWebsocket,
    getFirstMessage
  };
};

export default useSystemMessage;

export type SaveSystemMessageCallback = ((message: GetstreamMessage) => Promise<void>) | undefined;
