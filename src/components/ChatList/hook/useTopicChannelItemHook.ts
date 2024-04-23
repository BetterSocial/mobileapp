import * as React from 'react';
import moment from 'moment';

import getFeatureLoggerInstance, {EFeatureLogFlag} from '../../../utils/log/FeatureLog';
import {TopicChannelItemProps} from '../../../../types/component/ChatList/ChannelItem.types';

const {featLog} = getFeatureLoggerInstance(EFeatureLogFlag.useTopicChannelItemHook);

const useTopicChannelItemHook = (props: TopicChannelItemProps) => {
  const {channel, fetchTopicLatestMessage} = props;

  function _doFetchTopicLatestMessage() {
    featLog(channel?.id);
    featLog('checkpoint 1');
    if (!channel?.topicPostExpiredAt) return;
    featLog('checkpoint 2');
    if (!channel?.id) return;
    featLog('checkpoint 3');
    if (!fetchTopicLatestMessage) return;

    featLog('checkpoint 4');
    if (moment().diff(moment(channel?.topicPostExpiredAt), 'millisecond') > 0) {
      featLog('checkpoint 5');
      fetchTopicLatestMessage(channel?.id);
    }
  }

  React.useEffect(() => {
    _doFetchTopicLatestMessage();
  }, [channel?.topicPostExpiredAt]);
};

export default useTopicChannelItemHook;
