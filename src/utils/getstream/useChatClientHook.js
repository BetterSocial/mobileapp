import {putUserTopic} from '../../service/topics';

const useChatClientHook = () => {
  const followTopic = async (topic) => {
    const data = {
      name: topic
    };

    const response = await putUserTopic(data);

    return response?.data;
  };

  return {
    followTopic
  };
};

export default useChatClientHook;
