import {PREFIX_TOPIC} from '../constants';
import {convertString} from '../string/StringUtils';

const removePrefixTopic = (topicWithPrefix) => {
  if (topicWithPrefix === null || topicWithPrefix === undefined) return;

  if (topicWithPrefix.indexOf(PREFIX_TOPIC) > -1) {
    const topic = convertString(topicWithPrefix, PREFIX_TOPIC, '');
    return topic;
  }

  return topicWithPrefix;
};

export default removePrefixTopic;
