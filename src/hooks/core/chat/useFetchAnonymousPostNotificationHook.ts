import AnonymousMessageRepo from '../../../service/repo/anonymousMessageRepo';
import ChannelList from '../../../database/schema/ChannelListSchema';
import useLocalDatabaseHook from '../../../database/hooks/useLocalDatabaseHook';

const useFetchAnonymousPostNotificationHook = () => {
  const {localDb, refresh} = useLocalDatabaseHook();
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

  return {
    getAllAnonymousPostNotifications
  };
};

export default useFetchAnonymousPostNotificationHook;
