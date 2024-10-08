/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import {useRecoilState, useRecoilValue} from 'recoil';
import {useRoute} from '@react-navigation/native';

import {Platform} from 'react-native';
import AnonymousMessageRepo from '../../service/repo/anonymousMessageRepo';
import ChannelList from '../../database/schema/ChannelListSchema';
import ChatSchema from '../../database/schema/ChatSchema';
import SignedMessageRepo from '../../service/repo/signedMessageRepo';
import UseLocalDatabaseHook from '../../../types/database/localDatabase.types';
import UserSchema from '../../database/schema/UserSchema';
import migrationDbStatusAtom from '../../database/atom/migrationDbStatusAtom';
import useAppBadgeHook from '../appBadge/useAppBadgeHook';
import useBetterWebsocketHook from './websocket/useBetterWebsocketHook';
import useDatabaseQueueHook from './queue/useDatabaseQueueHook';
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
import {DEFAULT_PROFILE_PIC_PATH, DELETED_MESSAGE_TEXT} from '../../utils/constants';
import {DatabaseOperationLabel} from '../../core/queue/DatabaseQueue';
import {GetstreamFeedListenerObject} from '../../../types/hooks/core/getstreamFeedListener/feedListenerObject';
import {GetstreamMessage, GetstreamWebsocket, MyChannelType} from './websocket/types.d';
import {InitialStartupAtom} from '../../service/initialStartup';
import {QueueJobPriority} from '../../core/queue/BaseQueue';
import {SignedPostNotification} from '../../../types/repo/SignedMessageRepo/SignedPostNotificationData';
import {getChannelListInfo} from '../../utils/string/StringUtils';

const useCoreChatSystemHook = () => {
  const {localDb, refresh, refreshWithId} = useLocalDatabaseHook() as UseLocalDatabaseHook;
  const {anonProfileId, signedProfileId} = useUserAuthHook();
  const {getAllSignedChannels, getAllAnonymousChannels} = useFetchChannelHook();
  const {getAllSignedPostNotifications, getAllAnonymousPostNotifications} =
    useFetchPostNotificationHook();
  const {queue} = useDatabaseQueueHook();
  const {updateAppBadgeFromDB} = useAppBadgeHook();
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

    const hasUnreadMessage = selectedChannel?.unread_count >= 0;
    if (isMyMessage) return 0;
    if (hasUnreadMessage) return selectedChannel?.unread_count + 1;
    return 1;
  };

  const helperGetChannelInfo = (websocketData: GetstreamWebsocket) => {
    const channelData = websocketData?.channel;
    if (websocketData?.message?.channel_name) {
      channelData.name = websocketData?.message?.channel_name;
    }
    if (websocketData?.message?.channel_image) {
      channelData.image = websocketData?.message?.channel_image;
    }
    const channelInfo = getChannelListInfo(channelData, signedProfileId, anonProfileId);
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
      topics: isAnonymous ? 'ANON_TOPIC' : 'TOPIC',
      topicinvitation: 'TOPIC'
    };

    const isSystemMessage = websocketData?.message?.isSystem || websocketData?.type === 'system';

    if (isSystemMessage && isContainFollowingMessage) {
      const textOwnUser = 'You started following this user.\n Send them a message now.';
      if (Platform.OS === 'android') {
        await ChannelList.updateChannelDescription(
          localDb,
          websocketData?.channel_id,
          websocketData?.message?.textOwnMessage ?? textOwnUser,
          websocketData
        );
        const chat = ChatSchema.fromWebsocketObject(websocketData);
        await chat.save(localDb);
      } else {
        queue.addPriorityJob({
          operationLabel: DatabaseOperationLabel.CoreChatSystem_SaveFollowingMessage,
          id: `${websocketData?.channel?.id}-${websocketData?.message?.id}`,
          priority: QueueJobPriority.HIGH,
          task: async () => {
            await ChannelList.updateChannelDescription(
              localDb,
              websocketData?.channel_id,
              websocketData?.message?.textOwnMessage ?? textOwnUser,
              websocketData
            );
            const chat = ChatSchema.fromWebsocketObject(websocketData);
            await chat.save(localDb);
          }
        });
      }

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

        if (Platform.OS === 'android') {
          if (
            websocketData?.message?.message_type === 'notification-deleted' ||
            websocketData?.message?.message_type === 'deleted'
          ) {
            await Promise.all([channelList.save(localDb)]);
          } else {
            const chat = ChatSchema.fromWebsocketObject(newWebsocketData);
            await Promise.all([chat.save(localDb), channelList.save(localDb)]);
          }
        } else {
          queue.addPriorityJob({
            operationLabel: DatabaseOperationLabel.CoreChatSystem_GeneralSystemMessage,
            id: `${websocketData?.channel?.id}-${websocketData?.message?.id}`,
            priority: QueueJobPriority.HIGH,
            task: async () => {
              if (
                websocketData?.message?.message_type === 'notification-deleted' ||
                websocketData?.message?.message_type === 'deleted'
              ) {
                await Promise.all([channelList.save(localDb)]);
              } else {
                const chat = ChatSchema.fromWebsocketObject(newWebsocketData);
                await Promise.all([chat.save(localDb), channelList.save(localDb)]);
              }
            }
          });
        }
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

    helperWebsocketForDeletedMessage(websocketData);
    websocketData = helperGetChannelInfo(websocketData);
    websocketData = helperGetWebsocketMessage(websocketData);
    websocketData = await helperGetWebsocketUnreadCount(websocketData);
    websocketData = await helperGetSystemMessage(websocketData, channelCategory);

    // if (websocketData?.message?.deleted_message_id) {
    //   console.log('is deleted', websocketData?.message?.deleted_message_id);
    //   await ChatSchema.updateDeletedChatType(localDb, websocketData?.message?.deleted_message_id, {
    //     rawJson: websocketData,
    //     createdAt: websocketData?.message?.deleted_message_created_at || '',
    //     updatedAt: websocketData?.message?.deleted_message_updated_at || ''
    //   });
    // }

    if (websocketData?.message?.message_type === 'notification-deleted') {
      refresh('channelList');
      refresh('chat');
      return;
    }

    if (
      websocketData?.channel_type === 'topics' ||
      websocketData?.channel_type === 'topicinvitation'
    ) {
      refresh('channelList');
      return;
    }

    const isMyMessage =
      websocketMessage?.user?.id === signedProfileId ||
      websocketMessage?.user?.id === anonProfileId;

    if (!isMyMessage) {
      if (Platform.OS === 'android') {
        const chat = ChatSchema.fromWebsocketObject(websocketData);
        await chat.save(localDb);
      } else {
        queue.addPriorityJob({
          operationLabel: DatabaseOperationLabel.CoreChatSystem_SaveChat,
          id: `${websocketData?.channel?.id}-${websocketData?.message?.id}`,
          task: async () => {
            const chat = ChatSchema.fromWebsocketObject(websocketData);
            await chat.save(localDb);
          },
          priority: QueueJobPriority.HIGH
        });
      }
    }

    if (Platform.OS === 'android') {
      try {
        websocketData?.originalMembers?.forEach(async (member) => {
          const userMember = UserSchema.fromMemberWebsocketObject(
            member,
            websocketData?.channel?.id
          );
          await userMember.saveOrUpdateIfExists(localDb);
        });
      } catch (e) {
        console.log('error on memberSchema');
        console.log(e);
      }

      refresh('channelList');
      refreshWithId('chat', websocketData?.channel?.id);
      refresh('channelInfo');
      refresh('channelMember');
    } else {
      queue.addPriorityJob({
        operationLabel: DatabaseOperationLabel.CoreChatSystem_SaveUserMember,
        id: `${websocketData?.channel?.id}`,
        priority: QueueJobPriority.HIGH,
        task: async () => {
          try {
            websocketData?.originalMembers?.forEach(async (member) => {
              const userMember = UserSchema.fromMemberWebsocketObject(
                member,
                websocketData?.channel?.id
              );
              await userMember.saveOrUpdateIfExists(localDb);
            });
          } catch (e) {
            console.log('error on memberSchema');
            console.log(e);
          }

          refresh('channelList');
          refreshWithId('chat', websocketData?.channel?.id);
          refresh('channelInfo');
          refresh('channelMember');
        }
      });
    }

    updateAppBadgeFromDB(localDb);
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

  const helperWebsocketForDeletedMessage = async (websocketData: GetstreamWebsocket) => {
    const websocketMessage = websocketData?.message;
    const isDeletedMessage =
      websocketMessage?.message_type === 'notification-deleted' ||
      websocketMessage?.message_type === 'deleted';

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

      if (websocketMessage?.deleted_message_id) {
        ChatSchema.updateDeletedChatType(localDb, websocketMessage?.deleted_message_id, {
          rawJson: websocketMessage
        });
      }
    }
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
  }, [lastAnonymousMessage, localDb]);

  React.useEffect(() => {
    if (!lastSignedMessage || !localDb) return;
    const {type} = lastSignedMessage;
    if (type === 'health.check') return;
    if (type === 'notification.message_new' || type === 'notification.added_to_channel') {
      saveChannelListData(lastSignedMessage, SIGNED).catch((e) => console.log(e));
    }
  }, [lastSignedMessage, localDb]);

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
