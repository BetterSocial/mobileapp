/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import {useRecoilState, useRecoilValue} from 'recoil';
import {useRoute} from '@react-navigation/native';

import AnonymousMessageRepo from '../../service/repo/anonymousMessageRepo';
import ChannelList from '../../database/schema/ChannelListSchema';
import ChannelListMemberSchema from '../../database/schema/ChannelListMemberSchema';
import ChatSchema from '../../database/schema/ChatSchema';
import SignedMessageRepo from '../../service/repo/signedMessageRepo';
import UseLocalDatabaseHook from '../../../types/database/localDatabase.types';
import UserSchema from '../../database/schema/UserSchema';
import migrationDbStatusAtom from '../../database/atom/migrationDbStatusAtom';
import useBetterWebsocketHook from './websocket/useBetterWebsocketHook';
import useFetchChannelHook from './chat/useFetchChannelHook';
import useFetchPostNotificationHook from './chat/useFetchPostNotificationHook';
import useLocalDatabaseHook from '../../database/hooks/useLocalDatabaseHook';
import usePostNotificationListenerHook from './getstream/usePostNotificationListenerHook';
import useProfileHook from './profile/useProfileHook';
import {ANONYMOUS, SIGNED} from './constant';
import {
  AnonymousPostNotification,
  Comment,
  LatestChildrenComment
} from '../../../types/repo/AnonymousMessageRepo/AnonymousPostNotificationData';
import {ChannelType} from '../../../types/repo/ChannelData';
import {Context} from '../../context';
import {
  DEFAULT_PROFILE_PIC_PATH,
  DELETED_MESSAGE_TEXT,
  MESSAGE_TYPE_DELETED
} from '../../utils/constants';
import {GetstreamFeedListenerObject} from '../../../types/hooks/core/getstreamFeedListener/feedListenerObject';
import {GetstreamMessage, GetstreamWebsocket, MyChannelType} from './websocket/types.d';
import {InitialStartupAtom} from '../../service/initialStartup';
import {SignedPostNotification} from '../../../types/repo/SignedMessageRepo/SignedPostNotificationData';
import {getAnonymousChatName, getChatName} from '../../utils/string/StringUtils';
import {setReplyTarget} from '../../context/actions/chat';

const useCoreChatSystemHook = () => {
  const {localDb, refresh} = useLocalDatabaseHook() as UseLocalDatabaseHook;
  const {anonProfileId, signedProfileId, profile} = useProfileHook();
  const {getAllSignedChannels, getAllAnonymousChannels} = useFetchChannelHook();
  const {getAllSignedPostNotifications, getAllAnonymousPostNotifications} =
    useFetchPostNotificationHook();
  const [migrationStatus] = useRecoilState(migrationDbStatusAtom);
  const initialStartup: any = useRecoilValue(InitialStartupAtom);
  const {params} = useRoute();
  const [replyPreview, dispatch] = (React.useContext(Context) as unknown as any).chat;
  const [processedMessageId, setProcessedMessageId] = React.useState<string | null>(null);

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
      websocketData.targetImage =
        websocketData?.channel?.channel_image ?? websocketData.channel?.image;
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

  const helperWebsocketForDeletedMessage = async (websocketData: GetstreamWebsocket) => {
    const websocketMessage = websocketData?.message;
    const isDeletedMessage = websocketMessage?.message_type === MESSAGE_TYPE_DELETED;

    if (isDeletedMessage) {
      const selectedChat = await ChatSchema.getByid(
        localDb,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        websocketMessage.deleted_message_id!
      );
      const selectedCreatedAt = selectedChat.createdAt;
      const selectedUpdatedAt = selectedChat.updatedAt;

      websocketMessage.id = websocketMessage.deleted_message_id ?? '';
      websocketMessage.text = DELETED_MESSAGE_TEXT;
      websocketMessage.created_at = selectedCreatedAt ?? websocketMessage.created_at;
      websocketMessage.updated_at = selectedUpdatedAt ?? websocketMessage.updated_at;

      ChatSchema.updateDeletedRepliedChat(
        localDb,
        websocketData?.channel_id,
        websocketMessage.deleted_message_id ?? '',
        selectedChat.createdAt
      );

      const {replyTarget} = replyPreview;
      if (replyTarget && replyTarget?.id === websocketMessage?.deleted_message_id) {
        const newReplyPreview = {...replyTarget};
        newReplyPreview.message = DELETED_MESSAGE_TEXT;
        newReplyPreview.message_type = MESSAGE_TYPE_DELETED;
        setReplyTarget(newReplyPreview, dispatch);
      }
    }
  };

  const saveChannelListData = async (
    websocketData: GetstreamWebsocket,
    channelCategory: MyChannelType
  ) => {
    if (!localDb) return;
    const websocketMessage = websocketData?.message;

    helperWebsocketForDeletedMessage(websocketData);

    if (channelCategory === ANONYMOUS) {
      const chatName = await getAnonymousChatName(websocketData?.channel?.members);
      websocketData.targetName = chatName?.name;
      websocketData.targetImage = chatName?.image;
    } else {
      websocketData = await helperSignedChannelListData(websocketData);
    }

    websocketData.reply_data = websocketMessage?.reply_data;

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

    const {type, message} = lastAnonymousMessage;
    if (type === 'health.check') return;
    if (processedMessageId === message?.id) return;

    if (type === 'notification.message_new') {
      // to prevent being processed twice (websocket response appears twice)
      setProcessedMessageId(message?.id);
      saveChannelListData(lastAnonymousMessage, ANONYMOUS)
        .catch((e) => console.log(e))
        .finally(() => setProcessedMessageId(null));
    }
  }, [JSON.stringify(lastAnonymousMessage), localDb]);

  React.useEffect(() => {
    if (!lastSignedMessage || !localDb) return;

    const {type, message} = lastSignedMessage;
    if (type === 'health.check') return;
    if (processedMessageId === message?.id) return;

    if (type === 'notification.message_new' || type === 'notification.added_to_channel') {
      // to prevent being processed twice (websocket response appears twice)
      setProcessedMessageId(message?.id);
      saveChannelListData(lastSignedMessage, SIGNED)
        .catch((e) => console.log(e))
        .finally(() => setProcessedMessageId(null));
    }
  }, [JSON.stringify(lastSignedMessage), localDb]);

  React.useEffect(() => {
    const isResetNav = params?.isReset;
    if (isEnteringApp && migrationStatus === 'MIGRATED' && !isResetNav) {
      getAllSignedChannels().catch((e) => console.log(e));
      getAllSignedPostNotifications().catch((e) => console.log(e));
      getAllAnonymousChannels().catch((e) => console.log(e));
      getAllAnonymousPostNotifications().catch((e) => console.log(e));
    }
  }, [isEnteringApp, migrationStatus]);
};

export default useCoreChatSystemHook;
