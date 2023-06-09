import * as React from 'react';

import AnonymousMessageRepo from '../../service/repo/anonymousMessageRepo';
import ChannelList from '../../database/schema/ChannelListSchema';
import ChannelListMemberSchema from '../../database/schema/ChannelListMemberSchema';
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
    postNotifChannel.save(localDb).catch((e) => console.log(e));
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

    try {
      lastJsonMessage?.channel?.members?.forEach(async (member) => {
        const userMember = UserSchema.fromMemberWebsocketObject(member);
        await userMember.save(localDb);

        const memberSchema = ChannelListMemberSchema.fromWebsocketObject(
          lastJsonMessage?.channel?.id,
          lastJsonMessage?.message?.id,
          member
        );
        await memberSchema.save(localDb);
      });
    } catch (e) {
      console.log('error on memberSchema');
      console.log(e);
    }

    refresh('channelList');
    refresh('chat');
    refresh('channelInfo');
    refresh('channelMember');
  };

  const getAllAnonymousChannels = async () => {
    if (!localDb) return;
    let anonymousChannel = [];

    try {
      anonymousChannel = await AnonymousMessageRepo.getAllAnonymousChannels();
    } catch (e) {
      console.log('error on getting anonymousChannel');
      console.log(e);
    }

    try {
      const allPromises = [];
      anonymousChannel.forEach((channel) => {
        const channelList = ChannelList.fromAnonymousChannelAPI(channel);
        allPromises.push(channelList.saveIfLatest(localDb).catch((e) => console.log(e)));
      });

      await Promise.all(allPromises);
      refresh('channelList');
    } catch (e) {
      console.log('error on saving anonymousChannel');
      console.log(e);
    }
  };

  React.useEffect(() => {
    if (!lastJsonMessage && !localDb) return;

    const {type} = lastJsonMessage;
    if (type === 'health.check') return;
    if (type === 'notification.message_new') {
      saveChannelListData().catch((e) => console.log(e));
    }
  }, [lastJsonMessage, localDb]);

  React.useEffect(() => {
    getAllAnonymousChannels().catch((e) => console.log(e));
  }, [localDb]);
};

export default useCoreChatSystemHook;
