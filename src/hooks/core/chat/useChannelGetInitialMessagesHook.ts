import React from 'react';

import ChannelList from '../../../database/schema/ChannelListSchema';
import ChatSchema from '../../../database/schema/ChatSchema';
import useDatabaseQueueHook from '../queue/useDatabaseQueueHook';
import useLocalDatabaseHook from '../../../database/hooks/useLocalDatabaseHook';
import useUserAuthHook from '../auth/useUserAuthHook';
import {CHANNEL_LIST_GET_INITIAL_MESSAGES_LIMIT} from '../../../utils/constants';
import {DatabaseOperationLabel} from '../../../core/queue/DatabaseQueue';
import {QueueJobPriority} from '../../../core/queue/BaseQueue';

const useChannelGetInitialMessagesHook = () => {
  const {localDb, channelList} = useLocalDatabaseHook();
  const {anonProfileId, signedProfileId} = useUserAuthHook();
  const {queue} = useDatabaseQueueHook();

  const [visibleItems, setVisibleItems] = React.useState<ChannelList[]>([]);
  const initialMessagesHashMap = React.useRef<Record<string, ChatSchema>>({});

  const onViewableItemsChanged = (props) => {
    const visibleItemsOnScreen = props?.viewableItems?.map((item) => {
      return item?.item;
    });

    setVisibleItems(visibleItemsOnScreen);
  };

  const __getInitialMessageForVisibleItems = async () => {
    if (!localDb || !channelList || visibleItems?.length === 0) return;
    visibleItems?.map(async (item) => {
      const shouldVisibleItemGetInitialMessages = ['PM', 'ANON_PM', 'GROUP']?.includes(
        item?.channelType
      );

      if (!shouldVisibleItemGetInitialMessages) return;

      queue.addPriorityJob({
        operationLabel: DatabaseOperationLabel.ChannelList_GetInitialMessages,
        id: item?.id,
        priority: QueueJobPriority.HIGH,
        task: async () => {
          const chats = await ChatSchema.getAll(
            localDb,
            item?.id,
            signedProfileId,
            anonProfileId,
            CHANNEL_LIST_GET_INITIAL_MESSAGES_LIMIT
          );

          return chats;
        },
        callback: (chats) => {
          if (chats?.length > 0) {
            initialMessagesHashMap.current[item?.id] = chats;
          }
        }
      });
    });
  };

  const getInitialMessagesFromHashMap = (channelId: string) => {
    const initialMessages = initialMessagesHashMap.current[channelId];
    if (initialMessages) {
      return initialMessages;
    }
    return [];
  };

  React.useEffect(() => {
    __getInitialMessageForVisibleItems();
  }, [localDb, channelList, visibleItems]);

  const viewabilityConfigCallbackPairs = React.useRef([{onViewableItemsChanged}]);

  return {
    viewabilityConfigCallbackPairs,
    getInitialMessagesFromHashMap
  };
};

export default useChannelGetInitialMessagesHook;
