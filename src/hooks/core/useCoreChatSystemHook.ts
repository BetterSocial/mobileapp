/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import {useRecoilState, useRecoilValue} from 'recoil';
import {useRoute} from '@react-navigation/native';

import AnonymousMessageRepo from '../../service/repo/anonymousMessageRepo';
import ChannelList from '../../database/schema/ChannelListSchema';
import ChatSchema from '../../database/schema/ChatSchema';
import SignedMessageRepo from '../../service/repo/signedMessageRepo';
import StorageUtils from '../../utils/storage';
import UseLocalDatabaseHook from '../../../types/database/localDatabase.types';
import UserSchema from '../../database/schema/UserSchema';
import migrationDbStatusAtom from '../../database/atom/migrationDbStatusAtom';
import useBetterWebsocketHook from './websocket/useBetterWebsocketHook';
import useFetchChannelHook from './chat/useFetchChannelHook';
import useFetchPostNotificationHook from './chat/useFetchPostNotificationHook';
import useLocalDatabaseHook from '../../database/hooks/useLocalDatabaseHook';
import usePostNotificationListenerHook from './getstream/usePostNotificationListenerHook';
import useSystemMessage from './chat/useSystemMessage';
import useUserAuthHook from './auth/useUserAuthHook';
import {ANONYMOUS, SIGNED} from './constant';
import {
  AnonymousPostNotification,
  Comment,
  LatestChildrenComment
} from '../../../types/repo/AnonymousMessageRepo/AnonymousPostNotificationData';
import {ChannelType} from '../../../types/repo/ChannelData';
import {DEFAULT_PROFILE_PIC_PATH} from '../../utils/constants';
import {GetstreamFeedListenerObject} from '../../../types/hooks/core/getstreamFeedListener/feedListenerObject';
import {GetstreamMessage, GetstreamWebsocket, MyChannelType} from './websocket/types.d';
import {InitialStartupAtom} from '../../service/initialStartup';
import {SignedPostNotification} from '../../../types/repo/SignedMessageRepo/SignedPostNotificationData';
import {getChannelListInfo} from '../../utils/string/StringUtils';

const useCoreChatSystemHook = () => {
  const {localDb, refresh, refreshWithId} = useLocalDatabaseHook() as UseLocalDatabaseHook;
  const {anonProfileId, signedProfileId} = useUserAuthHook();
  const {getAllSignedChannels, getAllAnonymousChannels} = useFetchChannelHook();
  const {getAllSignedPostNotifications, getAllAnonymousPostNotifications} =
    useFetchPostNotificationHook();
  const [migrationStatus] = useRecoilState(migrationDbStatusAtom);
  const initialStartup: any = useRecoilValue(InitialStartupAtom);
  const {params} = useRoute();

  const {saveSystemMessageFromWebsocket} = useSystemMessage();

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

  const helperGetChannelInfo = (websocketData: GetstreamWebsocket) => {
    const channelInfo = getChannelListInfo(websocketData?.channel, signedProfileId, anonProfileId);
    websocketData.targetImage = channelInfo?.channelImage;
    websocketData.targetName = channelInfo?.channelName;
    websocketData.anon_user_info_color_code = channelInfo?.anonUserInfoColorCode;
    websocketData.anon_user_info_color_name = channelInfo?.anonUserInfoColorName;
    websocketData.anon_user_info_emoji_code = channelInfo?.anonUserInfoEmojiCode;
    websocketData.anon_user_info_emoji_name = channelInfo?.anonUserInfoEmojiName;
    websocketData.originalMembers = channelInfo?.originalMembers;

    return websocketData;
  };

  const helperGetWebsocketMessage = (websocketData: GetstreamWebsocket) => {
    const {type} = websocketData;

    if (type === 'notification.added_to_channel') {
      websocketData.message.text = 'You have been added to this group';
    }
    if (type === 'notification.removed_from_channel') {
      websocketData.message.text = 'You have been removed from this group';
    }

    return websocketData;
  };

  const helperGetWebsocketUnreadCount = async (websocketData: GetstreamWebsocket) => {
    let selectedChannel;
    try {
      selectedChannel = (await ChannelList.getById(localDb, websocketData?.channel_id)) as any;
    } catch (error) {
      console.log('error on getting selectedChannel');
    }

    websocketData.unread_count = getUnreadCount(websocketData?.message, selectedChannel);

    return websocketData;
  };

  const helperGetSystemMessage = async (
    websocketData: GetstreamWebsocket,
    channelCategory: MyChannelType
  ) => {
    /**
     * TODO: LEGACY FOLLOW SYSTEM USER, CHANGE TO NEW SYSTEM
     */
    const isContainFollowingMessage = websocketData?.message?.textOwnMessage
      ?.toLowerCase()
      ?.includes('you started following');

    const isAnonymous = channelCategory === ANONYMOUS;
    const channelType: {[key: string]: ChannelType} = {
      messaging: isAnonymous ? 'ANON_PM' : 'PM',
      group: 'GROUP',
      topics: isAnonymous ? 'ANON_TOPIC' : 'TOPIC'
    };

    const isSystemMessage = websocketData?.message?.isSystem || websocketData?.type === 'system';

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

      return websocketData;
    }
    /**
     * TODO END
     */

    /**
     * Process System Message Websocket
     */
    const newWebsocketData = {...websocketData};
    const isSuccess = await saveSystemMessageFromWebsocket(
      newWebsocketData?.message,
      async (newMessage) => {
        newWebsocketData.message = newMessage;
        const channelList = ChannelList.fromWebsocketObject(
          newWebsocketData,
          channelType[websocketData?.channel_type]
        );
        const chat = ChatSchema.fromWebsocketObject(newWebsocketData);
        await Promise.all([chat.save(localDb), channelList.save(localDb)]);
      }
    );

    if (isSuccess) return websocketData;
    /**
     * Process System Message Websocket (END)
     */

    return websocketData;
  };

  const saveChannelListData = async (
    websocketData: GetstreamWebsocket,
    channelCategory: MyChannelType
  ) => {
    if (!localDb) return;
    const websocketMessage = websocketData?.message;

    websocketData = helperGetChannelInfo(websocketData);
    websocketData = helperGetWebsocketMessage(websocketData);
    websocketData = await helperGetWebsocketUnreadCount(websocketData);
    websocketData = await helperGetSystemMessage(websocketData, channelCategory);

    if (websocketData?.channel_type === 'topics') {
      refresh('channelList');
      return;
    }

    const isMyMessage =
      websocketMessage?.user?.id === signedProfileId ||
      websocketMessage?.user?.id === anonProfileId;

    if (!isMyMessage) {
      const chat = ChatSchema.fromWebsocketObject(websocketData);
      await chat.save(localDb);
    }

    try {
      websocketData?.originalMembers?.forEach(async (member) => {
        const userMember = UserSchema.fromMemberWebsocketObject(member, websocketData?.channel?.id);
        await userMember.saveOrUpdateIfExists(localDb);
      });
    } catch (e) {
      console.log('error on memberSchema');
      console.log(e);
    }

    refresh('channelList');
    refreshWithId('chat', websocketData?.channel?.id);
    // refresh('chat');
    refresh('channelInfo');
    refresh('channelMember');
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
    const isResetNav = params?.isReset;
    // const hasInitialDataFetched = StorageUtils.fetchInitialData.get() === 'true';
    // if (isEnteringApp && migrationStatus === 'MIGRATED' && !isResetNav && !hasInitialDataFetched) {
    if (isEnteringApp && migrationStatus === 'MIGRATED' && !isResetNav) {
      getAllSignedChannels().catch((e) => console.log(e));
      getAllSignedPostNotifications().catch((e) => console.log(e));
      getAllAnonymousChannels().catch((e) => console.log(e));
      getAllAnonymousPostNotifications().catch((e) => console.log(e));
      StorageUtils.fetchInitialData.set('true');
    }
  }, [isEnteringApp, migrationStatus]);
};

export default useCoreChatSystemHook;
