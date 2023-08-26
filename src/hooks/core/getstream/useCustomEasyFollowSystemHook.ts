/* eslint-disable no-restricted-syntax */
import * as React from 'react';
import _ from 'lodash';
import axios from 'axios';

import {checkFollowStatusBatch} from '../../../service/users';

const useCustomEasyFollowSystemHook = () => {
  const [userIdsToCheck, setUserIdsToCheck] = React.useState<string[]>([]);
  const [followData, setFollowData] = React.useState({});

  const checkFollowStatusBatchCancelTokenRef = React.useRef(axios.CancelToken.source());

  const helperCancelCheckFollowStatusBatchAPICall = () => {
    checkFollowStatusBatchCancelTokenRef.current.cancel();
    checkFollowStatusBatchCancelTokenRef.current = axios.CancelToken.source();
  };

  const helperRemoveCheckedUserIds = (userIds: string[]) => {
    setUserIdsToCheck((prev) => _.pull(prev, userIds));
  };

  const callCheckFollowStatusBatch = async (userIds: string[]) => {
    try {
      const response = await checkFollowStatusBatch(userIds, checkFollowStatusBatchCancelTokenRef);
      setFollowData((prev) => ({
        ...prev,
        ...response
      }));
      helperRemoveCheckedUserIds(userIds);
    } catch (e) {
      console.log(e);
    }
  };

  const initiateFollowStatusCheck = async () => {
    if (userIdsToCheck.length === 0) return;
    helperCancelCheckFollowStatusBatchAPICall();

    const uniqueUserIds = _.uniq(userIdsToCheck);
    if (uniqueUserIds.length < 10) await callCheckFollowStatusBatch(uniqueUserIds);
    else {
      const chunkedUserIds = _.chunk(uniqueUserIds, 10);
      for (const element of chunkedUserIds) {
        callCheckFollowStatusBatch(element);
      }
    }
  };

  const addFollowStatusQueueCheck = (userId: string) => {
    console.log('addFollowStatusQueueCheck', userId);
    setUserIdsToCheck((prev) => _.uniq([...prev, userId]));
  };

  const debounceTime = 500;
  const debouncedCheckUsers = _.debounce(initiateFollowStatusCheck, debounceTime);

  React.useEffect(() => {
    debouncedCheckUsers();
  }, [userIdsToCheck]);

  return {
    checkFollowStatus: addFollowStatusQueueCheck,
    followData
  };
};

export default useCustomEasyFollowSystemHook;
