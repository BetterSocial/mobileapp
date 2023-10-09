import * as React from 'react';
import {StreamFeed, UR} from 'getstream';

import UseLocalDatabaseHook from '../../../../types/database/localDatabase.types';
import clientStream from '../../../utils/getstream/streamer';
import useLocalDatabaseHook from '../../../database/hooks/useLocalDatabaseHook';
import useProfileHook from '../profile/useProfileHook';
import TokenStorage, {ITokenEnum} from '../../../utils/storage/custom/tokenStorage';

const usePostNotificationListenerHook = (onPostNotifReceived, isAnonymous = true) => {
  const {localDb} = useLocalDatabaseHook() as UseLocalDatabaseHook;
  const feedSubscriptionRef = React.useRef<StreamFeed<UR, UR, UR, UR, UR, UR> | undefined>(
    undefined
  );

  const {anonProfileId, signedProfileId} = useProfileHook();

  const initFeedSubscription = async () => {
    const anonymousToken: string = TokenStorage.get(ITokenEnum.anonymousToken);
    const signedToken: string = TokenStorage.get(ITokenEnum.token);

    const tokenToSubscribe = isAnonymous ? anonymousToken : signedToken;
    const idToSubscribe = isAnonymous ? anonProfileId : signedProfileId;

    const client = clientStream(isAnonymous ? anonymousToken : signedToken);
    try {
      const notifFeed = client?.feed('notification', idToSubscribe, tokenToSubscribe);
      notifFeed?.subscribe((data) => {
        if (!data || !onPostNotifReceived || typeof onPostNotifReceived !== 'function') return;
        onPostNotifReceived(data);
      });

      feedSubscriptionRef.current = notifFeed;
    } catch (e) {
      console.log('profileId', isAnonymous ? anonProfileId : signedProfileId);
      console.log('token', isAnonymous ? anonymousToken : signedToken);
      console.log('initFeedSubscription error');
      console.log(e);
    }
  };

  React.useEffect(() => {
    if (anonProfileId && isAnonymous) initFeedSubscription();

    return () => {
      feedSubscriptionRef.current?.unsubscribe();
    };
  }, [localDb, anonProfileId]);

  React.useEffect(() => {
    if (anonProfileId && !isAnonymous) initFeedSubscription();

    return () => {
      feedSubscriptionRef.current?.unsubscribe();
    };
  }, [localDb, anonProfileId]);

  return {
    feedSubscriptionRef
  };
};

export default usePostNotificationListenerHook;
