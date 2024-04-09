import * as React from 'react';
import moment from 'moment';

import {TopicChannelItemProps} from '../../../../types/component/ChatList/ChannelItem.types';

const useTopicChannelItemHook = (props: TopicChannelItemProps) => {
  const {channel, fetchTopicLatestMessage} = props;

  function _doFetchTopicLatestMessage() {
    console.log(channel?.id);
    console.log('checkpoint 1');
    if (!channel?.topic_post_expired_at) return;
    console.log('checkpoint 2');
    if (!channel?.id) return;
    console.log('checkpoint 3');
    if (!fetchTopicLatestMessage) return;

    console.log('checkpoint 4');
    if (moment().diff(moment(channel?.topic_post_expired_at), 'millisecond') > 0) {
      console.log('checkpoint 5');
      fetchTopicLatestMessage(channel?.id);
    }
  }

  React.useEffect(() => {
    _doFetchTopicLatestMessage();
  }, [channel?.topic_post_expired_at]);
};

export default useTopicChannelItemHook;
