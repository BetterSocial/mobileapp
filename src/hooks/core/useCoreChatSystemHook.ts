import * as React from 'react';
import {useRecoilValue} from 'recoil';
import {v4 as uuid} from 'uuid';

import AnonymousMessageRepo from '../../service/repo/anonymousMessageRepo';
import ChannelList from '../../database/schema/ChannelListSchema';
import ChannelListMemberSchema from '../../database/schema/ChannelListMemberSchema';
import ChatSchema from '../../database/schema/ChatSchema';
import UseLocalDatabaseHook from '../../../types/database/localDatabase.types';
import UserSchema from '../../database/schema/UserSchema';
import useBetterWebsocketHook from './websocket/useBetterWebsocketHook';
import useLocalDatabaseHook from '../../database/hooks/useLocalDatabaseHook';
import usePostNotificationListenerHook from './getstream/usePostNotificationListenerHook';
import useProfileHook from './profile/useProfileHook';
import {
  AnonymousPostNotification,
  Comment,
  LatestChildrenComment
} from '../../../types/repo/AnonymousMessageRepo/AnonymousPostNotificationData';
import {GetstreamFeedListenerObject} from '../../../types/hooks/core/getstreamFeedListener/feedListenerObject';
import {InitialStartupAtom} from '../../service/initialStartup';
import {getAnonymousChatName} from '../../utils/string/StringUtils';

const useCoreChatSystemHook = () => {
  const {localDb, refresh} = useLocalDatabaseHook() as UseLocalDatabaseHook;
  const {anonProfileId, signedProfileId} = useProfileHook();
  const initialStartup: any = useRecoilValue(InitialStartupAtom);

  const isEnteringApp =
    initialStartup?.id !== null && initialStartup?.id !== undefined && initialStartup?.id !== '';

  const onPostNotifReceived: (data: GetstreamFeedListenerObject) => Promise<void> = async (
    data
  ) => {
    try {
      const activityId = data?.new[0]?.object?.id || data?.new[0]?.id;
      await getSingleAnonymousPostNotification(activityId);
    } catch (e) {
      console.log('error getSingleAnonymousPostNotification');
      console.log(e);
    }
  };

  usePostNotificationListenerHook(onPostNotifReceived);
  const {lastJsonMessage} = useBetterWebsocketHook();

  const saveChannelListData = async () => {
    if (!localDb) return;

    const chatName = await getAnonymousChatName(lastJsonMessage?.channel?.members);

    lastJsonMessage.targetName = chatName?.name;
    lastJsonMessage.targetImage = chatName?.image;

    const channelList = ChannelList.fromWebsocketObject(lastJsonMessage);
    await channelList.save(localDb);

    const user = UserSchema.fromWebsocketObject(lastJsonMessage);
    await user.saveOrUpdateIfExists(localDb);

    const isMyMessage =
      lastJsonMessage?.message?.user?.id === signedProfileId ||
      lastJsonMessage?.message?.user?.id === anonProfileId;

    if (!isMyMessage) {
      const chat = ChatSchema.fromWebsocketObject(lastJsonMessage);
      await chat.save(localDb);
    }
    try {
      lastJsonMessage?.channel?.members?.forEach(async (member) => {
        const userMember = UserSchema.fromMemberWebsocketObject(
          member,
          lastJsonMessage?.channel?.id
        );
        await userMember.saveOrUpdateIfExists(localDb);

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

  const helperAnonymousChannelPromiseBuilder = async (channel) => {
    if (channel?.members?.length === 0) return Promise.reject(Error('no members'));

    const chatName = await getAnonymousChatName(channel?.members);
    return new Promise((resolve, reject) => {
      try {
        channel.targetName = chatName?.name;
        channel.targetImage = chatName?.image;
        channel.firstMessage = channel?.messages?.[0];
        channel.channel = {...channel};
        const channelList = ChannelList.fromAnonymousChannelAPI(channel);
        return resolve(channelList.saveIfLatest(localDb));
      } catch (e) {
        console.log('error on helperAnonymousChannelPromiseBuilder');
        return reject(e);
      }
    });
  };

  const saveAnonymousChannelData = async (channel) => {
    if (!channel?.members || channel?.members?.length === 0) return;
    try {
      await helperAnonymousChannelPromiseBuilder(channel);
    } catch (e) {
      console.log('error on saveAnonymousChannelData helperAnonymousChannelPromiseBuilder');
      console.log(e);
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
      console.log('error on saveAnonymousChannelData');
      console.log(e);
    }
  };

  const saveAllAnonymousChannelData = async (channels) => {
    channels?.forEach(async (channel) => {
      saveAnonymousChannelData(channel);
    });
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
      await saveAllAnonymousChannelData(anonymousChannel);
      refresh('channelList');
    } catch (e) {
      console.log('error on saving anonymousChannel');
      console.log(e);
    }
  };

  const helperDetermineIsMyChildComment = (postNotification: AnonymousPostNotification) => {
    let latestComment: Comment = null;
    let latestCommentLatestChild: LatestChildrenComment = null;
    const postHasComment = postNotification?.comments?.length > 0;
    let isMyComment = false;
    let isMyChildComment = false;

    if (postHasComment) {
      latestComment = postNotification?.comments[0];
      isMyComment = latestComment?.reaction?.isOwningReaction;
      if (latestComment?.reaction?.latest_children?.comment?.length > 0) {
        latestCommentLatestChild = latestComment?.reaction?.latest_children?.comment[0];
        const latestCommentLatestChildUserId = latestCommentLatestChild?.user_id;
        isMyChildComment =
          latestCommentLatestChildUserId === signedProfileId ||
          latestCommentLatestChildUserId === anonProfileId;
      }
    }

    return {
      isMyComment,
      isMyChildComment
    };
  };

  const unreadCountProcessor = (postNotification: AnonymousPostNotification) => {
    const isMyPost = postNotification?.isOwnPost;
    const postHasComment = postNotification?.comments?.length > 0;

    const {isMyComment, isMyChildComment} = helperDetermineIsMyChildComment(postNotification);

    if (isMyPost && postHasComment) {
      // Return 1 if the post is my post and has comment from other user(PoN2)
      // Return 0 if the post is my post and is my comment(PoN3)
      return isMyComment ? 0 : 1;
    }

    // Return 0 if the post is my post and has no comment yet (PoN1)
    if (isMyPost && !postHasComment) return 0;

    // Return 0 if the post is other's post, has comment and has my child comment(PoN7)
    if (!isMyPost && postHasComment && isMyComment && isMyChildComment) return 0;

    // Return 1 if the post is other's post, not my comment and has my child comment(PoN6)
    if (!isMyPost && postHasComment && !isMyComment && isMyChildComment) return 1;

    if (!isMyPost && postHasComment && isMyComment)
      // Return 0 if the post is other's post and has my comment(PoN4)
      return 0;

    return 0;
  };

  const getSingleAnonymousPostNotification = async (activityId) => {
    if (!localDb) return;
    let anonymousPostNotification: AnonymousPostNotification = null;

    try {
      anonymousPostNotification = await AnonymousMessageRepo.getSingleAnonymousPostNotifications(
        activityId
      );
    } catch (e) {
      console.log('error on getting anonymousPostNotifications');
      console.log(e);
    }

    try {
      if (!anonymousPostNotification) return;
      const unreadCount = unreadCountProcessor(anonymousPostNotification);
      const channelList = ChannelList.fromAnonymousPostNotificationAPI(anonymousPostNotification);
      channelList.saveAndUpdateIncrementCount(localDb, unreadCount).catch((e) => console.log(e));

      refresh('channelList');
    } catch (e) {
      console.log('error on saving anonymousPostNotifications');
      console.log(e);
    }
  };

  const getAllAnonymousPostNotifications = async () => {
    if (!localDb) return;
    let anonymousPostNotifications = [];

    try {
      anonymousPostNotifications = await AnonymousMessageRepo.getAllAnonymousPostNotifications();
    } catch (e) {
      console.log('error on getting anonymousPostNotifications');
      console.log(e);
    }

    try {
      const allPromises = [];
      anonymousPostNotifications.forEach((postNotification) => {
        const channelList = ChannelList.fromAnonymousPostNotificationAPI(postNotification);
        allPromises.push(channelList.saveIfLatest(localDb).catch((e) => console.log(e)));
      });

      await Promise.all(allPromises);
      refresh('channelList');
    } catch (e) {
      console.log('error on saving anonymousPostNotifications');
      console.log(e);
    }
  };

  React.useEffect(() => {
    console.log({lastJsonMessage, localDb}, 'timan');
    if (!lastJsonMessage && !localDb) return;

    const {type} = lastJsonMessage;
    if (type === 'health.check') return;
    if (type === 'notification.message_new') {
      saveChannelListData().catch((e) => console.log(e));
    }
  }, [lastJsonMessage, localDb]);

  React.useEffect(() => {
    if (isEnteringApp) {
      getAllAnonymousPostNotifications().catch((e) => console.log(e));
      getAllAnonymousChannels().catch((e) => console.log(e));
    }
  }, [localDb, isEnteringApp]);
};

export default useCoreChatSystemHook;
