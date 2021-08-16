import {ADD_NEWS_I_FOLLOW, SET_NEWS, SET_NEWS_I_FOLLOW} from '../Types';

const newsState = {
  news: [],
  ifollow: [],
};
const newsReducer = (state = newsState, action) => {
  switch (action.type) {
    case SET_NEWS:
      return {
        ...state,
        news: action.payload,
      };
    case SET_NEWS_I_FOLLOW:
      return {
        ...state,
        ifollow: action.payload,
      };
    case ADD_NEWS_I_FOLLOW:
      let newState = [...state.ifollow, action.payload];
      return {
        ...state,
        ifollow: newState,
      };
    default:
      return state;
  }
};
export {newsReducer, newsState};
