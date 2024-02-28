/* eslint-disable @typescript-eslint/no-explicit-any */
import AnonymousMessageRepo from '../../../service/repo/anonymousMessageRepo';
import ChannelList from '../../../database/schema/ChannelListSchema';
import SignedMessageRepo from '../../../service/repo/signedMessageRepo';
import useLocalDatabaseHook from '../../../database/hooks/useLocalDatabaseHook';

const useFetchPostNotificationHook = () => {
  const {localDb, refresh} = useLocalDatabaseHook();

  const saveNotifications = async (notifications: any[], fromNotificationAPI: any) => {
    if (!localDb) return;
    const allPromises: Promise<void>[] = notifications.map((notification) => {
      const channelList = fromNotificationAPI(notification);
      return channelList.save(localDb);
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

  return {
    getAllSignedPostNotifications,
    getAllAnonymousPostNotifications
  };
};

export default useFetchPostNotificationHook;
