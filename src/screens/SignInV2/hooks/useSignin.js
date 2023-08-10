import React from 'react';

import {TOPICS_PICK} from '../../../utils/cache/constant';
import {get} from '../../../api/server';
import {saveToCache} from '../../../utils/cache';
import {Monitoring} from '../../../libraries/monitoring/sentry';

const useSignin = () => {
  const [topicCollection, setTopics] = React.useState([]);
  const [isTopicFetchError, setIsTopicFetchError] = React.useState(false);
  const [isFetchingTopic, setIsFetchingTopic] = React.useState(false);

  const topicMapping = (data) => {
    const allTopics = [];
    if (data && typeof data === 'object') {
      Object.keys(data).forEach((attribute) =>
        allTopics.push({
          name: attribute,
          data: data[attribute].map((att) => ({
            topic_id: att.topic_id,
            name: att.name.toLowerCase()
          }))
        })
      );
    }
    setTopics(allTopics);
    saveToCache(TOPICS_PICK, allTopics);
  };

  const getTopicsData = () => {
    setIsFetchingTopic(true);
    get({url: '/topics/list'})
      .then((res) => {
        if (res.status === 200) {
          Monitoring.logActions('Topic from API', res.data.body);
          topicMapping(res.data.body);
        }

        setIsFetchingTopic(false);
      })
      .catch((e) => {
        setIsTopicFetchError(true);
        setIsFetchingTopic(false);
        if (__DEV__) {
          console.log('topics error: ', e);
        }
      });
  };

  return {isFetchingTopic, isTopicFetchError, getTopicsData, topicCollection};
};

export default useSignin;
