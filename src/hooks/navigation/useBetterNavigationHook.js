import {useNavigation} from '@react-navigation/core';

import {NavigationConstants} from '../../utils/constants';

const useBetterNavigationHook = () => {
  const navigation = useNavigation();

  const toCreatePost = () => {
    navigation.navigate(NavigationConstants.CREATE_POST_SCREEN);
  };

  const toCreatePostWithTopic = (topic) => {
    if (topic === undefined || topic === null) throw new Error('topic is undefined');
    if (typeof topic !== 'string') throw new Error('topic is not a string');
    if (topic?.trim().length === 0) throw new Error('topic is empty');

    navigation.navigate(NavigationConstants.CREATE_POST_SCREEN, {topic});
  };

  return {
    toCreatePost,
    toCreatePostWithTopic
  };
};

export default useBetterNavigationHook;
