import {SET_MY_PROFILE_FEED} from '../Types';

const myProfileFeedState = {
  feeds: [],
};

const myProfileFeedReducer = (state = myProfileFeedState, action) => {
  switch (action.type) {
    case SET_MY_PROFILE_FEED:
      return {
        ...state,
        feeds: action.payload,
      };
    default:
      return state;
  }
};

export {myProfileFeedReducer, myProfileFeedState};
