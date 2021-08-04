import {SET_TOPICS} from '../Types';

export const setTopics = (topics, dispatch) => {
  dispatch({
    type: SET_TOPICS,
    payload: topics,
  });
};
