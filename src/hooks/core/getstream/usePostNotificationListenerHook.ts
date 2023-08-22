import * as React from 'react';
import {StreamFeed, UR} from 'getstream';

import UseLocalDatabaseHook from '../../../../types/database/localDatabase.types';
import clientStream from '../../../utils/getstream/streamer';
import useLocalDatabaseHook from '../../../database/hooks/useLocalDatabaseHook';
import useProfileHook from '../profile/useProfileHook';
import TokenStorage, {ITokenEnum} from '../../../utils/storage/custom/tokenStorage';

const usePostNotificationListenerHook = (onPostNotifReceived) => {
  const {localDb} = useLocalDatabaseHook() as UseLocalDatabaseHook;
  const feedSubscriptionRef = React.useRef<StreamFeed<UR, UR, UR, UR, UR, UR> | undefined>(
    undefined
  );
  const {anonProfileId} = useProfileHook();

  const initFeedSubscription = async () => {
    const token: string = TokenStorage.get(ITokenEnum.anonymousToken);
    const client = clientStream(token);
    try {
      const notifFeed = client?.feed('notification', anonProfileId, token);
      notifFeed?.subscribe((data) => {
        if (!data || !onPostNotifReceived || typeof onPostNotifReceived !== 'function') return;
        onPostNotifReceived(data);
      });

      feedSubscriptionRef.current = notifFeed;
    } catch (e) {
      console.log('anonProfileId', anonProfileId);
      console.log('token', token);
      console.log('initFeedSubscription error');
      console.log(e);
    }
  };

  React.useEffect(() => {
    if (anonProfileId) initFeedSubscription();

    return () => {
      feedSubscriptionRef.current?.unsubscribe();
    };
  }, [localDb, anonProfileId]);

  return {
    feedSubscriptionRef
  };
};

export default usePostNotificationListenerHook;
