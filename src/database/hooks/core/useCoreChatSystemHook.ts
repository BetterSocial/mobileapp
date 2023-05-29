import * as React from 'react';
import {StreamFeed, UR} from 'getstream';

import ChannelList from '../../schema/ChannelListSchema';
import clientStream from '../../../utils/getstream/streamer';
import useBetterWebsocketHook from './useBetterWebsocketHook';
import useLocalDatabaseHook from '../useLocalDatabaseHook';
import {getAnonymousToken} from '../../../utils/token';
import {getAnonymousUserId} from '../../../utils/users';

const useCoreChatSystemHook = () => {
  const {localDb} = useLocalDatabaseHook();
  /**
   * @type {[ChannelList[], (messages: ChannelList[]) => void]]}
   */
  const [messages, setMessages] = React.useState([]);

  const {lastJsonMessage} = useBetterWebsocketHook();

  const feedSubscriptionRef = React.useRef<StreamFeed<UR, UR, UR, UR, UR, UR> | undefined>(
    undefined
  );

  const initChannelListData = async () => {
    if (!localDb) return;
    const data = await ChannelList.getAll(localDb);
    setMessages(data);
  };

  const initFeedSubscription = async () => {
    const token: string = await getAnonymousToken();
    const userId: string = await getAnonymousUserId();
    const client = clientStream(token);
    const notifFeed = client?.feed('notification', userId, token);
    notifFeed?.subscribe((data) => {
      const postNotifChannel = ChannelList.fromPostNotifObject(data);
      postNotifChannel.save(localDb);
      initChannelListData();
    });

    feedSubscriptionRef.current = notifFeed;
  };

  const saveChannelListData = async () => {
    if (!localDb) return;
    const channelList = ChannelList.fromWebsocketObject(lastJsonMessage);
    channelList.save(localDb);
    initChannelListData();
  };

  React.useEffect(() => {
    if (!lastJsonMessage && !localDb) return;

    const {type} = lastJsonMessage;
    if (type === 'health.check') return;
    if (type === 'notification.message_new') {
      saveChannelListData();
    }
  }, [lastJsonMessage, localDb]);

  React.useEffect(() => {
    if (localDb) initChannelListData();

    initFeedSubscription();
  }, [localDb]);

  return {
    lastJsonMessage,
    channelList: messages
  };
};

export default useCoreChatSystemHook;
