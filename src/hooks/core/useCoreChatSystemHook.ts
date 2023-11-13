/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import {useRecoilState, useRecoilValue} from 'recoil';
import {v4 as uuid} from 'uuid';

import AnonymousMessageRepo from '../../service/repo/anonymousMessageRepo';
import ChannelList from '../../database/schema/ChannelListSchema';
import ChannelListMemberSchema from '../../database/schema/ChannelListMemberSchema';
import ChatSchema from '../../database/schema/ChatSchema';
import SignedMessageRepo from '../../service/repo/signedMessageRepo';
import UseLocalDatabaseHook from '../../../types/database/localDatabase.types';
import UserSchema from '../../database/schema/UserSchema';
import migrationDbStatusAtom from '../../database/atom/migrationDbStatusAtom';
import useBetterWebsocketHook from './websocket/useBetterWebsocketHook';
import useLocalDatabaseHook from '../../database/hooks/useLocalDatabaseHook';
import usePostNotificationListenerHook from './getstream/usePostNotificationListenerHook';
import useProfileHook from './profile/useProfileHook';
import {ANONYMOUS, SIGNED} from './constant';
import {
  AnonymousPostNotification,
  Comment,
  LatestChildrenComment
} from '../../../types/repo/AnonymousMessageRepo/AnonymousPostNotificationData';
import {ChannelData, ChannelType} from '../../../types/repo/ChannelData';
import {DEFAULT_PROFILE_PIC_PATH} from '../../utils/constants';
import {GetstreamFeedListenerObject} from '../../../types/hooks/core/getstreamFeedListener/feedListenerObject';
import {GetstreamMessage, GetstreamWebsocket, MyChannelType} from './websocket/types.d';
import {InitialStartupAtom} from '../../service/initialStartup';
import {SignedPostNotification} from '../../../types/repo/SignedMessageRepo/SignedPostNotificationData';
import {getAnonymousChatName, getChatName} from '../../utils/string/StringUtils';

type ChannelCategory = 'SIGNED' | 'ANONYMOUS';

const useCoreChatSystemHook = () => {
  const {localDb, refresh} = useLocalDatabaseHook() as UseLocalDatabaseHook;
  const {anonProfileId, signedProfileId, profile} = useProfileHook();
  const [migrationStatus] = useRecoilState(migrationDbStatusAtom);
  const initialStartup: any = useRecoilValue(InitialStartupAtom);

  const isEnteringApp =
    initialStartup?.id !== null && initialStartup?.id !== undefined && initialStartup?.id !== '';

  const onAnonPostNotifReceived: (data: GetstreamFeedListenerObject) => Promise<void> = async (
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

  const handleChannelImage = (members) => {
    if (members?.length > 2) {
      return DEFAULT_PROFILE_PIC_PATH;
    }
    const findMember = members?.find((data) => data?.user_id !== signedProfileId);
    if (findMember) {
      return findMember?.user?.image;
    }
    return DEFAULT_PROFILE_PIC_PATH;
  };

  const onSignedPostNotifReceived: (data: GetstreamFeedListenerObject) => Promise<void> = async (
    data
  ) => {
    try {
      const activityId = data?.new[0]?.object?.id || data?.new[0]?.id;
      await getSingleSignedPostNotification(activityId);
    } catch (e) {
      console.log('error getSingleSignedPostNotification');
      console.log(e);
    }
  };

  usePostNotificationListenerHook(onAnonPostNotifReceived, true);
  usePostNotificationListenerHook(onSignedPostNotifReceived, false);

  const {lastAnonymousMessage, lastSignedMessage} = useBetterWebsocketHook();

  const getUnreadCount = (message: GetstreamMessage, selectedChannel): number => {
    const isMyMessage =
      message?.user?.id === signedProfileId || message?.user?.id === anonProfileId;

    const hasUnreadMessage = selectedChannel?.unread_count <= 0;
    if (isMyMessage) return 0;
    if (hasUnreadMessage) return selectedChannel?.unread_count + 1;
    return 1;
  };

  const helperSignedChannelListData = async (websocketData: GetstreamWebsocket) => {
    const {type} = websocketData;
    const websocketMessage = websocketData?.message;

    const chatName = await getChatName(websocketData?.channel?.name, profile?.username);
    if (websocketData?.channel?.anon_user_info_emoji_name) {
      websocketData.targetName = `Anonymous ${websocketData?.channel?.anon_user_info_emoji_name}`;
    } else {
      websocketData.targetName = chatName;
    }

    let selectedChannel;
    try {
      selectedChannel = (await ChannelList.getById(localDb, websocketData?.channel_id)) as any;
    } catch (error) {
      console.log('error on getting selectedChannel');
    }

    websocketData.targetImage = handleChannelImage(websocketData?.channel?.members);
    const websocketChannelType = websocketData?.channel_type;
    if (websocketChannelType === 'topics' || websocketChannelType === 'group') {
      websocketData.targetImage = websocketData?.channel?.channel_image;
    } else {
      websocketData.targetImage = selectedChannel?.channel_picture ?? websocketMessage?.user?.image;
    }

    if (type === 'notification.added_to_channel') {
      websocketData.message.text = 'You have been added to this group';
    }
    if (type === 'notification.removed_from_channel') {
      websocketData.message.text = 'You have been removed from this group';
    }

    websocketData.unread_count = getUnreadCount(websocketMessage, selectedChannel);
    websocketData.anon_user_info_color_name = websocketData?.channel?.anon_user_info_color_name;
    websocketData.anon_user_info_emoji_code = websocketData?.channel?.anon_user_info_emoji_code;
    websocketData.anon_user_info_color_code = websocketData?.channel?.anon_user_info_color_code;

    return websocketData;
  };

  const saveChannelListData = async (
    websocketData: GetstreamWebsocket,
    channelCategory: MyChannelType
  ) => {
    if (!localDb) return;
    const websocketMessage = websocketData?.message;

    if (channelCategory === ANONYMOUS) {
      const chatName = await getAnonymousChatName(websocketData?.channel?.members);
      websocketData.targetName = chatName?.name;
      websocketData.targetImage = chatName?.image;
    } else {
      websocketData = await helperSignedChannelListData(websocketData);
    }

    const isAnonymous = channelCategory === ANONYMOUS;
    const channelType: {[key: string]: ChannelType} = {
      messaging: isAnonymous ? 'ANON_PM' : 'PM',
      group: 'GROUP',
      topics: 'TOPIC'
    };

    const isContainFollowingMessage = websocketData?.message?.textOwnMessage
      ?.toLowerCase()
      ?.includes('you started following');
    const isSystemMessage = websocketMessage?.isSystem || websocketData?.type === 'system';
    if (isSystemMessage && isContainFollowingMessage) {
      const textOwnUser = 'You started following this user.\n Send them a message now.';
      await ChannelList.updateChannelDescription(
        localDb,
        websocketData?.channel_id,
        websocketData?.message?.textOwnMessage ?? textOwnUser,
        websocketData
      );
      const chat = ChatSchema.fromWebsocketObject(websocketData);
      await chat.save(localDb);
    } else {
      const channelList = ChannelList.fromWebsocketObject(
        websocketData,
        channelType[websocketData?.channel_type]
      );
      await channelList.save(localDb);
    }

    if (websocketData?.channel_type === 'topics') {
      refresh('channelList');
      return;
    }

    const user = UserSchema.fromWebsocketObject(websocketData);
    await user.saveOrUpdateIfExists(localDb);

    const isMyMessage =
      websocketMessage?.user?.id === signedProfileId ||
      websocketMessage?.user?.id === anonProfileId;

    if (!isMyMessage) {
      const chat = ChatSchema.fromWebsocketObject(websocketData);
      await chat.save(localDb);
    }
    try {
      websocketData?.channel?.members?.forEach(async (member) => {
        const userMember = UserSchema.fromMemberWebsocketObject(member, websocketData?.channel?.id);
        await userMember.saveOrUpdateIfExists(localDb);

        const memberSchema = ChannelListMemberSchema.fromWebsocketObject(
          websocketData?.channel?.id,
          websocketData?.message?.id,
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

  const helperChannelPromiseBuilder = async (channel, channelCategory: ChannelCategory) => {
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

    try {
      const channelList = ChannelList.fromChannelAPI(channel, type[channelType]);
      await channelList.saveIfLatest(localDb);
      refresh('channelList');
    } catch (e) {
      console.log('error on helperChannelPromiseBuilder');
    }
    return null;
  };

  const saveChannelData = async (channel, channelCategory: ChannelCategory) => {
    if (!channel?.members || channel?.members?.length === 0) return;

    try {
      await helperChannelPromiseBuilder(channel, channelCategory);
    } catch (e) {
      console.log('error on saveChannelData helperChannelPromiseBuilder:', e);
    }

    if (channel?.type === 'topics') return;

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
          await chat.save(localDb);
        })
      );
    } catch (e) {
      console.log('error on saveChannelData:', e);
    }
  };

  const saveAllChannelData = async (channels, channelCategory: ChannelCategory) => {
    const filteredChannels = channels.filter((channel) => {
      const isLocationChannel = channel?.channel_type === 2 || channel?.type_channel === 2;
      const isDeletedMessage = channel?.firstMessage?.type === 'deleted';
      const isSelfChatChannel = channel?.type === 'messaging' && channel?.members?.length < 2;

      return !isLocationChannel && !(isDeletedMessage || isSelfChatChannel);
    });

    filteredChannels.forEach(async (channel) => {
      await saveChannelData(channel, channelCategory);
    });
  };

  const getAllSignedChannels = async () => {
    if (!localDb) return;
    let signedChannel;

    try {
      signedChannel = await SignedMessageRepo.getAllSignedChannels();
    } catch (e) {
      console.log('error on getting signedChannel:', e);
    }

    try {
      await saveAllChannelData(signedChannel ?? [], 'SIGNED');
      refresh('channelList');
    } catch (e) {
      console.log('error on saving signedChannel:', e);
    }
  };

  const getAllAnonymousChannels = async () => {
    if (!localDb) return;
    let anonymousChannel: ChannelData[] = [];
    try {
      anonymousChannel = await AnonymousMessageRepo.getAllAnonymousChannels();
    } catch (e) {
      console.log('error on getting anonymousChannel:', e);
    }

    try {
      await saveAllChannelData(anonymousChannel, 'ANONYMOUS');
      refresh('channelList');
    } catch (e) {
      console.log('error on saving anonymousChannel:', e);
    }
  };

  const helperDetermineIsMyChildComment = (postNotification: AnonymousPostNotification) => {
    let latestComment: Comment | null = null;
    let latestCommentLatestChild: LatestChildrenComment | null = null;
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

  const getSingleSignedPostNotification = async (activityId) => {
    if (!localDb) return;
    let signedPostNotification: SignedPostNotification | null = null;

    try {
      signedPostNotification = await SignedMessageRepo.getSingleSignedPostNotifications(activityId);
    } catch (e) {
      console.log('error on getting signedPostNotifications');
      console.log(e);
    }

    try {
      if (!signedPostNotification) return;
      const unreadCount = unreadCountProcessor(signedPostNotification);
      const channelList = ChannelList.fromSignedPostNotificationAPI(signedPostNotification);
      channelList.saveAndUpdateIncrementCount(localDb, unreadCount).catch((e) => console.log(e));

      refresh('channelList');
    } catch (e) {
      console.log('error on saving signedPostNotifications');
      console.log(e);
    }
  };

  const getSingleAnonymousPostNotification = async (activityId) => {
    if (!localDb) return;
    let anonymousPostNotification: AnonymousPostNotification | null = null;

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

  const saveNotifications = async (notifications: any[], fromNotificationAPI: any) => {
    if (!localDb) return;
    const allPromises: Promise<void>[] = notifications.map((notification) => {
      const channelList = fromNotificationAPI(notification);
      return channelList.saveIfLatest(localDb);
    });

    try {
      await Promise.all(allPromises);
      refresh('channelList');
    } catch (e) {
      console.log('error on saving notifications:', e);
    }
  };

  const getAllSignedPostNotifications = async () => {
    try {
      const signedPostNotifications = await SignedMessageRepo.getAllSignedPostNotifications();
      saveNotifications(signedPostNotifications, ChannelList.fromSignedPostNotificationAPI);
    } catch (e) {
      console.log('error on getting signedPostNotifications:', e);
    }
  };

  const getAllAnonymousPostNotifications = async () => {
    try {
      const anonymousPostNotifications =
        await AnonymousMessageRepo.getAllAnonymousPostNotifications();
      saveNotifications(anonymousPostNotifications, ChannelList.fromAnonymousPostNotificationAPI);
    } catch (e) {
      console.log('error on getting anonymousPostNotifications', e);
    }
  };

  React.useEffect(() => {
    if (!lastAnonymousMessage || !localDb) return;

    const {type} = lastAnonymousMessage;
    if (type === 'health.check') return;
    if (type === 'notification.message_new') {
      saveChannelListData(lastAnonymousMessage, ANONYMOUS).catch((e) => console.log(e));
    }
  }, [JSON.stringify(lastAnonymousMessage), localDb]);

  React.useEffect(() => {
    if (!lastSignedMessage || !localDb) return;

    const {type} = lastSignedMessage;
    if (type === 'health.check') return;
    if (type === 'notification.message_new' || type === 'notification.added_to_channel') {
      saveChannelListData(lastSignedMessage, SIGNED).catch((e) => console.log(e));
    }
  }, [JSON.stringify(lastSignedMessage), localDb]);

  React.useEffect(() => {
    if (isEnteringApp && migrationStatus === 'MIGRATED') {
      getAllSignedChannels().catch((e) => console.log(e));
      getAllSignedPostNotifications().catch((e) => console.log(e));
      getAllAnonymousChannels().catch((e) => console.log(e));
      getAllAnonymousPostNotifications().catch((e) => console.log(e));
    }
  }, [isEnteringApp, migrationStatus]);
};

export default useCoreChatSystemHook;
