import {useRoute} from '@react-navigation/core';

const useCreatePostHook = () => {
  const {params = {}} = useRoute();
  const {topic} = params;

  const headerTitle = topic ? `Create Post in #${topic}` : 'Create Post';

  const isInCreatePostTopicScreen = !!topic;

  return {
    headerTitle,
    initialTopic: topic ? [topic] : [],
    isInCreatePostTopicScreen
  };
};

export default useCreatePostHook;
