import * as React from 'react';

import ChannelList from '../../database/schema/ChannelListSchema';
import ChatSchema from '../../database/schema/ChatSchema';
import UseLocalDatabaseHook from '../../../types/database/localDatabase.types';
import UserSchema from '../../database/schema/UserSchema';
import useBetterWebsocketHook from './websocket/useBetterWebsocketHook';
import useLocalDatabaseHook from '../../database/hooks/useLocalDatabaseHook';
import usePostNotificationListenerHook from './getstream/usePostNotificationListenerHook';

const useCoreChatSystemHook = () => {
  const {localDb, refresh} = useLocalDatabaseHook() as UseLocalDatabaseHook;

  const onPostNotifReceived = (data) => {
    const postNotifChannel = ChannelList.fromPostNotifObject(data);
    postNotifChannel.save(localDb);
  };

  usePostNotificationListenerHook(onPostNotifReceived);
  const {lastJsonMessage} = useBetterWebsocketHook();

  const saveChannelListData = async () => {
    if (!localDb) return;
    const channelList = ChannelList.fromWebsocketObject(lastJsonMessage);
    await channelList.save(localDb);

    const user = UserSchema.fromWebsocketObject(lastJsonMessage);
    await user.save(localDb);

    const chat = ChatSchema.fromWebsocketObject(lastJsonMessage);
    await chat.save(localDb);

    refresh('channelList');
    refresh('chat');
    refresh('channelInfo');
  };

  React.useEffect(() => {
    if (!lastJsonMessage && !localDb) return;

    const {type} = lastJsonMessage;
    if (type === 'health.check') return;
    if (type === 'notification.message_new') {
      saveChannelListData();
    }
  }, [lastJsonMessage, localDb]);
};

export default useCoreChatSystemHook;
