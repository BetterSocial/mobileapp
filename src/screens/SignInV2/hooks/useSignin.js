import {get} from '../../../api/server';
import {saveToCache} from '../../../utils/cache'
import { TOPICS_PICK } from '../../../utils/cache/constant';

const useSignin = () => {
    const topicMapping = (data) => {
        const allTopics = []
        if(data && typeof data ==='object') {
            Object.keys(data).forEach((attribute) => allTopics.push({name: attribute, data: data[attribute].map((att) => ({topic_id: att.topic_id, name: att.name}))}))
        }
        saveToCache(TOPICS_PICK, allTopics)
    }
    
    const getTopicsData = () => {
        get({url: '/topics/list'}).then((res) => {
        if (res.status === 200) {
          topicMapping(res.data.body)
        }
      })
      .catch((e) => {
        console.log(e)
      });
    }



    return {getTopicsData}
}


export default useSignin