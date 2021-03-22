import {SET_TOPICS} from '../Types';

const topicsState = {
  topics: [],
};
const topicsReducer = (state = topicsState, action) => {
  switch (action.type) {
    case SET_TOPICS:
      return {
        topics: action.payload,
      };
    default:
      return state;
  }
};
export {topicsReducer, topicsState};
