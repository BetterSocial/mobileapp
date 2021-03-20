import {SET_TOPICS} from '../Types';

export const setTopics = (topics, dispatch) => {
  console.log('topic ', topics);
  dispatch({
    type: SET_TOPICS,
    payload: topics,
  });
};
