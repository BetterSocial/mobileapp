/* eslint-disable no-restricted-syntax */
import * as React from 'react';
import _ from 'lodash';
import axios from 'axios';
import {useRecoilState} from 'recoil';

import {checkFollowStatusBatch} from '../../../service/users';
import {followersOrFollowingAtom} from '../../../screens/ChannelListScreen/model/followersOrFollowingAtom';
import {setFollow} from '../../../service/profile';

const useCustomEasyFollowSystemHook = () => {
  const [userIdsToCheck, setUserIdsToCheck] = React.useState<string[]>([]);
  const [followData, setFollowData] = React.useState({});
  const [, setFollowUserList] = useRecoilState(followersOrFollowingAtom);

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
    setUserIdsToCheck((prev) => _.uniq([...prev, userId]));
  };

  const followUserFunction = async (
    userId: string,
    targetUserId: string,
    username: string,
    targetUsername: string
  ) => {
    const requestData = {
      user_id_follower: userId,
      user_id_followed: targetUserId,
      username_follower: username,
      username_followed: targetUsername,
      follow_source: 'chat'
    };

    try {
      await setFollow(requestData);
    } catch (e) {
      console.log(e);
      setFollowUserList((prev) => [...prev, requestData]);
    } finally {
      setFollowData((prev) => {
        const newFollowData = {...prev};
        newFollowData[targetUserId] = {
          ...newFollowData[targetUserId],
          is_following: true
        };
        return newFollowData;
      });
    }
  };

  const debounceTime = 500;
  const debouncedCheckUsers = _.debounce(initiateFollowStatusCheck, debounceTime);

  React.useEffect(() => {
    debouncedCheckUsers();
  }, [userIdsToCheck]);

  return {
    followData,
    checkFollowStatus: addFollowStatusQueueCheck,
    followUserFunction
  };
};

export default useCustomEasyFollowSystemHook;
