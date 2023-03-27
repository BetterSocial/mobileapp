import React from 'react';
import {get} from '../../../api/server';
import {saveToCache} from '../../../utils/cache';
import {TOPICS_PICK} from '../../../utils/cache/constant';
import {Monitoring} from '../../../libraries/monitoring/sentry';

const useSignin = () => {
  const [topicCollection, setTopics] = React.useState([]);
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

    Monitoring.logActions('set topics data from cache', topicMapping);
    setTopics(allTopics);
    saveToCache(TOPICS_PICK, allTopics);
  };

  const getTopicsData = () => {
    get({url: '/topics/list'})
      .then((res) => {
        if (res.status === 200) {
          topicMapping(res.data.body);
        }
      })
      .catch((e) => {
        if (__DEV__) {
          console.log('topics error: ', e);
        }
      });
  };

  return {getTopicsData, topicCollection};
};

export default useSignin;
