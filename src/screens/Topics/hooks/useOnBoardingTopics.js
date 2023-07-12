import React from 'react';
import {useNavigation} from '@react-navigation/core';
import {Context} from '../../../context';
import {getSpecificCache} from '../../../utils/cache';
import {TOPICS_PICK} from '../../../utils/cache/constant';
import useSignin from '../../SignInV2/hooks/useSignin';
import {Analytics} from '../../../libraries/analytics/firebaseAnalytics';
import {setTopics as setTopicsContext} from '../../../context/actions/topics';

const useOnBoardingTopics = () => {
  const navigation = useNavigation();
  const [topicSelected, setTopicSelected] = React.useState([]);
  const [topics, setTopics] = React.useState([]);
  const [minTopic, setMinTopic] = React.useState(3);
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

  const handleSelectedLanguage = React.useCallback(
    (val) => {
      if (!myTopic[val]) {
        setMyTopic({...myTopic, [val]: val});
      } else {
        setMyTopic({...myTopic, [val]: null});
      }
      let copytopicSelected = [...topicSelected];
      const index = copytopicSelected.findIndex((data) => data === val);
      if (index > -1) {
        copytopicSelected = copytopicSelected.filter((data) => data !== val);
      } else {
        copytopicSelected.push(val);
      }
      setTopicSelected(copytopicSelected);
    },
    [topicSelected]
  );

  const next = () => {
    if (topicSelected.length >= minTopic) {
      Analytics.logEvent('onb_select_topics_add_btn', {
        onb_topics_selected: topicSelected
      });
      setTopicsContext(topicSelected, dispatch);
      navigation.navigate('WhotoFollow');
    }
  };

  const onBack = () => {
    navigation.goBack();
  };

  const keyExtractor = React.useCallback((item, index) => index.toString(), []);

  return {
    topicSelected,
    setTopicSelected,
    topics,
    setTopics,
    minTopic,
    myTopic,
    setMyTopic,
    isPreload,
    setIspreload,
    getCacheTopic,
    handleSelectedLanguage,
    next,
    onBack,
    keyExtractor,
    isFetchingTopic,
    isTopicFetchError,
    topicCollection,
    getTopicsData,
    setMinTopic
  };
};

export default useOnBoardingTopics;
