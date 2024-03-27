/* eslint-disable @typescript-eslint/no-explicit-any */
import AnonymousMessageRepo from '../../../service/repo/anonymousMessageRepo';
import ChannelList from '../../../database/schema/ChannelListSchema';
import SignedMessageRepo from '../../../service/repo/signedMessageRepo';
import useDatabaseQueueHook from '../queue/useDatabaseQueueHook';
import useLocalDatabaseHook from '../../../database/hooks/useLocalDatabaseHook';
import StorageUtils from '../../../utils/storage';

const useFetchPostNotificationHook = () => {
  const {localDb, refresh} = useLocalDatabaseHook();
  const {queue} = useDatabaseQueueHook();

  const saveNotifications = async (notifications: any[], fromNotificationAPI: any) => {
    if (!localDb) return;

    notifications.map((notification) => {
      queue.addJob({
        label: 'save post notifications',
        task: async () => {
          const channelList = fromNotificationAPI(notification);
          await channelList.save(localDb);
        }
      });

      return null;
    });

    queue.addJob({
      label: 'refresh channelList',
      task: async () => {
        refresh('channelList');
      }
    });
  };

  const getAllSignedPostNotifications = async () => {
    const previousTimestamp = StorageUtils.signedNotificationTimeStamp.get();

    try {
      const signedPostNotifications = await SignedMessageRepo.getAllSignedPostNotifications(
        previousTimestamp as string
      );
      const timeStamp = new Date().toISOString();
      await saveNotifications(signedPostNotifications, ChannelList.fromSignedPostNotificationAPI);
      StorageUtils.signedNotificationTimeStamp.set(timeStamp);
    } catch (e) {
      console.log('error on getting signedPostNotifications:', e);
    }
  };

  const getAllAnonymousPostNotifications = async () => {
    try {
      const previousTimestamp = StorageUtils.anonymousNotificationTimeStamp.get();
      const anonymousPostNotifications =
        await AnonymousMessageRepo.getAllAnonymousPostNotifications(previousTimestamp as string);
      await saveNotifications(
        anonymousPostNotifications,
        ChannelList.fromAnonymousPostNotificationAPI
      );
      // update timestamp
      const timestamp = new Date().toISOString();
      StorageUtils.anonymousNotificationTimeStamp.set(timestamp);
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
