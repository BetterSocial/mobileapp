import React from 'react';
import {useNavigation} from '@react-navigation/core';
import {Context} from '../../../context';
import {getSpecificCache} from '../../../utils/cache';
import {TOPICS_PICK} from '../../../utils/cache/constant';
import useSignin from '../../SignInV2/hooks/useSignin';

const useOnBoardingTopics = () => {
  const navigation = useNavigation();
  const [topicSelected, setTopicSelected] = React.useState([]);
  const [topics, setTopics] = React.useState([]);
  const [minTopic] = React.useState(3);
  const [, dispatch] = React.useContext(Context).topics;
  const [myTopic, setMyTopic] = React.useState({});
  const [isPreload, setIspreload] = React.useState(true);
  const {isFetchingTopic, isTopicFetchError, getTopicsData, topicCollection} = useSignin();

  const getCacheTopic = async () => {
    getSpecificCache(TOPICS_PICK, (cache) => {
      if (cache) {
        setTopics(cache);
        setIspreload(false);
      } else {
        getTopicsData();
        setIspreload(false);
      }
    });
  };

  return {
    topicSelected,
    setTopicSelected,
    topics,
    setTopics,
    minTopic,
    myTopic,
    setMyTopic,
    isPreload,
    setIspreload
  };
};

export default useOnBoardingTopics;
