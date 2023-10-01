import * as React from 'react';
import {v4 as uuid} from 'uuid';

import AnonymousMessageRepo from '../../../service/repo/anonymousMessageRepo';
import ChannelList from '../../../database/schema/ChannelListSchema';
import ChannelListMemberSchema from '../../../database/schema/ChannelListMemberSchema';
import ChatSchema from '../../../database/schema/ChatSchema';
import UserSchema from '../../../database/schema/UserSchema';
import useLocalDatabaseHook from '../../../database/hooks/useLocalDatabaseHook';
import {ChannelData} from '../../../../types/repo/AnonymousMessageRepo/ChannelData';
import {getAnonymousChatName} from '../../../utils/string/StringUtils';

const useFetchAnonymousChannelHook = () => {
  const {localDb, refresh} = useLocalDatabaseHook();
  const __helperAnonymousChannelPromiseBuilder = async (channel) => {
    if (channel?.members?.length === 0) return Promise.reject(Error('no members'));

    const chatName = await getAnonymousChatName(channel?.members);
    return new Promise((resolve, reject) => {
      try {
        channel.targetName = chatName?.name;
        channel.targetImage = chatName?.image;
        channel.firstMessage = channel?.messages?.[0];
        channel.channel = {...channel};
        const channelList = ChannelList.fromChannelAPI(channel, 'ANON_PM');
        return resolve(channelList.saveIfLatest(localDb));
      } catch (e) {
        console.log('error on helperAnonymousChannelPromiseBuilder');
        return reject(e);
      }
    });
  };

  const __saveAnonymousChannelData = async (channel) => {
    if (!channel?.members || channel?.members?.length === 0) return;
    try {
      await __helperAnonymousChannelPromiseBuilder(channel);
    } catch (e) {
      console.log('error on saveAnonymousChannelData helperAnonymousChannelPromiseBuilder', e);
    }

    try {
      channel?.members?.forEach(async (member) => {
        const userMember = UserSchema.fromMemberWebsocketObject(member, channel.id);
        const memberSchema = ChannelListMemberSchema.fromWebsocketObject(
          channel?.id,
          uuid(),
          member
        );
        await memberSchema.save(localDb);
        await userMember.saveOrUpdateIfExists(localDb);
      });

      channel?.messages?.forEach(async (message) => {
        const chat = ChatSchema.fromGetAllAnonymousChannelAPI(channel?.id, message);
        await chat.save(localDb);
      });
    } catch (e) {
      console.log('error on saveAnonymousChannelData', e);
    }
  };

  const __saveAllAnonymousChannelData = async (channels) => {
    channels?.forEach(async (channel) => {
      __saveAnonymousChannelData(channel);
    });
  };

  const getAllAnonymousChannels = async () => {
    if (!localDb) return;
    let anonymousChannel: ChannelData[] = [];

    try {
      anonymousChannel = await AnonymousMessageRepo.getAllAnonymousChannels();
    } catch (e) {
      console.log('error on getting anonymousChannel', e);
    }

    try {
      await __saveAllAnonymousChannelData(anonymousChannel);
      refresh('channelList');
    } catch (e) {
      console.log('error on saving anonymousChannel', e);
    }
  };

  return {
    getAllAnonymousChannels
  };
};

export default useFetchAnonymousChannelHook;
