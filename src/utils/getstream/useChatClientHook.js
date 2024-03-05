import {putUserTopic} from '../../service/topics';

const useChatClientHook = () => {
  const followTopic = async (topic, isIncognito) => {
    const data = {
      name: topic
    };

    const response = await putUserTopic(data, isIncognito);

    return response?.data;
  };

  return {
    followTopic
  };
};

export default useChatClientHook;
