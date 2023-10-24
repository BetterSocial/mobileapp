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
import {
  AnonymousPostNotification,
  Comment,
  LatestChildrenComment
} from '../../../types/repo/AnonymousMessageRepo/AnonymousPostNotificationData';
import {DEFAULT_PROFILE_PIC_PATH} from '../../utils/constants';
import {GetstreamFeedListenerObject} from '../../../types/hooks/core/getstreamFeedListener/feedListenerObject';
import {GetstreamWebsocket} from './websocket/types.d';
import {InitialStartupAtom} from '../../service/initialStartup';
import {SignedPostNotification} from '../../../types/repo/SignedMessageRepo/SignedPostNotificationData';
import {getAnonymousChatName, getChatName} from '../../utils/string/StringUtils';

type ChannelType = 'SIGNED' | 'ANONYMOUS';

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

  const {lastJsonMessage, lastSignedMessage} = useBetterWebsocketHook();

  const channelImage = (websocket: GetstreamWebsocket) => {
    const roleMember = websocket?.channel?.members?.find(
      (channel) => channel?.user?.name === websocket?.targetName
    );
    return roleMember?.user;
  };

  const saveChannelListData = async (
    websocketData: GetstreamWebsocket,
    channelType: 'PM' | 'ANON_PM'
  ) => {
    if (!localDb) return;
    if (channelType === 'ANON_PM') {
      const chatName = await getAnonymousChatName(websocketData?.channel?.members);
      websocketData.targetName = chatName?.name;
      websocketData.targetImage = chatName?.image;
    } else {
      const chatName = await getChatName(websocketData?.channel?.name, profile?.username);
      if (websocketData?.channel?.anon_user_info_emoji_name) {
        websocketData.targetName = `Anonymous ${websocketData?.channel?.anon_user_info_emoji_name}`;
      } else {
        websocketData.targetName = chatName;
      }
      websocketData.targetImage = websocketData.message?.user?.image;
      websocketData.anon_user_info_color_name = websocketData?.channel?.anon_user_info_color_name;
      websocketData.anon_user_info_emoji_code = websocketData?.channel?.anon_user_info_emoji_code;
      websocketData.anon_user_info_color_code = websocketData?.channel?.anon_user_info_color_code;
    }

    const channelList = ChannelList.fromWebsocketObject(websocketData, channelType);

    await channelList.save(localDb);

    const user = UserSchema.fromWebsocketObject(websocketData);
    await user.saveOrUpdateIfExists(localDb);

    const isMyMessage =
      websocketData?.message?.user?.id === signedProfileId ||
      websocketData?.message?.user?.id === anonProfileId;

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

  const helperChannelPromiseBuilder = async (channel, channelType: ChannelType) => {
    if (channel?.members?.length === 0) return Promise.reject(Error('no members'));

    const isAnonymous = channelType === 'ANONYMOUS';

    let signedChannelProfile;
    let signedChannelName;
    let signedChannelImage;

    if (!isAnonymous) {
      signedChannelProfile = channel?.members?.find(
        (member) => member?.user_id === signedProfileId
      )?.user;

      signedChannelName =
        channel?.channel_type === 4
          ? `Anonymous ${channel?.anon_user_info_emoji_name}`
          : getChatName(channel?.name, signedChannelProfile?.username);
      signedChannelImage =
        channel?.members?.length > 2
          ? DEFAULT_PROFILE_PIC_PATH
          : channel?.members?.find((member) => member?.user_id !== signedProfileId)?.user?.image;
    }

    const chatName = isAnonymous
      ? await getAnonymousChatName(channel?.members)
      : {
          name: signedChannelName,
          image: signedChannelImage ?? DEFAULT_PROFILE_PIC_PATH
        };

    return new Promise((resolve, reject) => {
      try {
        channel.targetName = chatName?.name;
        channel.targetImage = chatName?.image;
        if (isAnonymous) {
          channel.firstMessage = channel?.messages?.[0];
        } else {
          channel.firstMessage = channel?.messages?.[channel?.messages?.length - 1];
        }
        channel.channel = {...channel};
        const channelList = ChannelList.fromChannelAPI(channel, isAnonymous ? 'ANON_PM' : 'PM');
        return resolve(channelList.saveIfLatest(localDb));
      } catch (e) {
        console.log('error on helperChannelPromiseBuilder');
        return reject(e);
      }
    });
  };

  const saveChannelData = async (channel, channelType: ChannelType) => {
    if (!channel?.members || channel?.members?.length === 0) return;

    try {
      await helperChannelPromiseBuilder(channel, channelType);
    } catch (e) {
      console.log('error on saveChannelData helperChannelPromiseBuilder');
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
        const chat = ChatSchema.fromGetAllChannelAPI(channel?.id, message);
        await chat.save(localDb);
      });
    } catch (e) {
      console.log('error on saveChannelData');
      console.log(e);
    }
  };

  const saveAllChannelData = async (channels, channelType: ChannelType) => {
    channels?.forEach(async (channel) => {
      saveChannelData(channel, channelType);
    });
  };

  const getAllSignedChannels = async () => {
    if (!localDb) return;
    let signedChannel = [];

    try {
      signedChannel = await SignedMessageRepo.getAllSignedChannels();
    } catch (e) {
      console.log('error on getting signedChannel');
      console.log(e);
    }

    try {
      await saveAllChannelData(signedChannel, 'SIGNED');
      refresh('channelList');
    } catch (e) {
      console.log('error on saving signedChannel');
      console.log(e);
    }
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
      await saveAllChannelData(anonymousChannel, 'ANONYMOUS');
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

  const getSingleSignedPostNotification = async (activityId) => {
    if (!localDb) return;
    let signedPostNotification: SignedPostNotification = null;

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

  const getAllSignedPostNotifications = async () => {
    if (!localDb) return;
    let signedPostNotifications = [];

    try {
      signedPostNotifications = await SignedMessageRepo.getAllSignedPostNotifications();
    } catch (e) {
      console.log('error on getting signedPostNotifications');
      console.log(e);
    }

    try {
      const allPromises = [];
      signedPostNotifications.forEach((postNotification) => {
        const channelList = ChannelList.fromSignedPostNotificationAPI(postNotification);
        allPromises.push(channelList.saveIfLatest(localDb).catch((e) => console.log(e)));
      });

      await Promise.all(allPromises);
      refresh('channelList');
    } catch (e) {
      console.log('error on saving signedPostNotifications');
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
    if (!lastJsonMessage && !localDb) return;

    const {type} = lastJsonMessage;
    if (type === 'health.check') return;
    if (type === 'notification.message_new') {
      saveChannelListData(lastJsonMessage, 'ANON_PM').catch((e) => console.log(e));
    }
  }, [lastJsonMessage, localDb]);

  React.useEffect(() => {
    if (!lastSignedMessage && !localDb) return;

    const {type} = lastSignedMessage;
    if (type === 'health.check') return;
    if (type === 'notification.message_new') {
      saveChannelListData(lastSignedMessage, 'PM').catch((e) => console.log(e));
    }
  }, [lastSignedMessage, localDb]);

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
