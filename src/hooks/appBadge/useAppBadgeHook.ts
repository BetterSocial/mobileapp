import PushNotification from 'react-native-push-notification';
import {SQLiteDatabase} from 'react-native-sqlite-storage';

import ChannelList from '../../database/schema/ChannelListSchema';
import useDatabaseQueueHook from '../core/queue/useDatabaseQueueHook';
import {DatabaseOperationLabel} from '../../core/queue/DatabaseQueue';

const useAppBadgeHook = () => {
  const {queue} = useDatabaseQueueHook();

  const updateAppBadgeFromDB = (localDb: SQLiteDatabase) => {
    if (!localDb) return;

    queue.addJob({
      operationLabel: DatabaseOperationLabel.AppBadge_UpdateBadgeNumber,
      id: new Date().valueOf().toString(),
      task: async () => {
        try {
          const allUnreadCount = await ChannelList.getAllUnreadCount(localDb);
          PushNotification.setApplicationIconBadgeNumber(allUnreadCount || 0);
        } catch (e) {
          console.error(e);
        }
      }
    });
  };

  const updateAppBadgeWith = (badgeNumber: number) => {
    try {
      PushNotification.setApplicationIconBadgeNumber(badgeNumber || 0);
    } catch (e) {
      console.error(e);
    }
  };

  return {
    updateAppBadgeFromDB,
    updateAppBadgeWith
  };
};

export default useAppBadgeHook;
