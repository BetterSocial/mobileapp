import {
  ADD_NEWS_I_FOLLOW,
  NEWS_UPDATE_COMMENT,
  SET_NEWS,
  SET_NEWS_I_FOLLOW,
  SET_NEWS_RESET_ALL
} from '../Types';

const newsState = {
  news: [],
  ifollow: []
};

const updateComment = (state = newsState, action) => {
  const {comment, activityId} = action?.payload;

  const duplicatedNews = [...state?.news];
  const findNewsIndex = duplicatedNews?.findIndex((item) => item?.id === activityId);

  const newComment = [...(duplicatedNews[findNewsIndex]?.latest_reactions?.comment || [])];
  newComment?.unshift(comment);
  if (findNewsIndex >= 0) {
    duplicatedNews[findNewsIndex].latest_reactions.comment = newComment;
    duplicatedNews[findNewsIndex].reaction_counts = {comment: newComment?.length};
  }
  return {
    ...state,
    news: duplicatedNews
  };
};

const newsReducer = (state = newsState, action) => {
  switch (action.type) {
    case SET_NEWS:
      return {
        ...state,
        news: action.payload
      };
    case SET_NEWS_I_FOLLOW:
      return {
        ...state,
        ifollow: action.payload
      };
    case ADD_NEWS_I_FOLLOW:
      const newState = [...state.ifollow, action.payload];
      return {
        ...state,
        ifollow: newState
      };
    case NEWS_UPDATE_COMMENT:
      return updateComment(state, action);

    case SET_NEWS_RESET_ALL:
      return newsState;

    default:
      return state;
  }
};
export {newsReducer, newsState};
