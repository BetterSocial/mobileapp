import * as React from 'react';

import {Context} from '../../context';
import {DEFAULT_TOPIC_PIC_PATH} from '../constants';
import {putUserTopic} from '../../service/topics';

const useChatClientHook = () => {
  const [client] = React.useContext(Context).client;
  const [user] = React.useContext(Context).profile;
  const defaultImage = DEFAULT_TOPIC_PIC_PATH;

  const addTopicToChatTab = async (topic) => {
    const filter = {id: {$eq: `topic_${topic}`}};

    const queryChannel = await client.client.queryChannels(filter);
    let text = '';
    if (queryChannel.length > 0) {
      const filterMessage = queryChannel[0].state.messages.filter((message) => message.text !== '');
      text = filterMessage[filterMessage.length - 1].text;
    }
    const channel = await client.client.channel('topics', `topic_${topic}`, {
      name: `#${topic}`,
      members: [user.myProfile.user_id],
      channel_type: 3,
      channel_image: defaultImage,
      channelImage: defaultImage,
      image: defaultImage
    });
    await channel.create();
    await channel.addMembers([user.myProfile.user_id]);
    await channel.sendMessage({text}, {skip_push: true});
  };

  const removeTopicFromChatTab = async (topic) => {
    const channel = await client.client.channel('topics', `topic_${topic}`);

    await channel.removeMembers([user?.myProfile?.user_id]);
  };

  const followTopic = async (topic) => {
    const data = {
      name: topic
    };

    const response = await putUserTopic(data);
    if (response?.data) {
      addTopicToChatTab(topic);
    } else {
      removeTopicFromChatTab(topic);
    }

    return response?.data;
  };

  return {
    followTopic
  };
};

export default useChatClientHook;