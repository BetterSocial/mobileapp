import * as React from 'react';
import {StreamFeed, UR} from 'getstream';

import clientStream from '../../../utils/getstream/streamer';
import {getAnonymousToken} from '../../../utils/token';
import {getAnonymousUserId} from '../../../utils/users';

const usePostNotificationListenerHook = (onPostNotifReceived) => {
  const feedSubscriptionRef = React.useRef<StreamFeed<UR, UR, UR, UR, UR, UR> | undefined>(
    undefined
  );

  const initFeedSubscription = async () => {
    console.log('initFeedSubscription');
    const token: string = await getAnonymousToken();
    const userId: string = await getAnonymousUserId();
    const client = clientStream(token);
    const notifFeed = client?.feed('notification', userId, token);
    notifFeed?.subscribe((data) => {
      console.log('postnotif received', data?.new[0]);
      if (!data || !onPostNotifReceived || typeof onPostNotifReceived !== 'function') return;
      onPostNotifReceived(data);
    });

    feedSubscriptionRef.current = notifFeed;
  };

  React.useEffect(() => {
    initFeedSubscription();

    return () => {
      feedSubscriptionRef.current?.unsubscribe();
    };
  }, []);

  return {
    feedSubscriptionRef
  };
};

export default usePostNotificationListenerHook;
