import { PREFIX_TOPIC } from "../constants"
import { convertString } from "../string/StringUtils"


const removePrefixTopic = topicWithPrefix => {
    const topic = convertString(topicWithPrefix, PREFIX_TOPIC, '');
    return topic;
}

export default removePrefixTopic;